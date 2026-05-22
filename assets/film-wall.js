import React, { useEffect, useMemo, useRef, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import * as THREE from "https://esm.sh/three@0.165.0";
import { buildFilmWallModel } from "./film-wall-data.js";

const h = React.createElement;
const CARD = { width: 2.55, height: 3.62 };
const MOTION = {
  panDamping: 0.18,
  zoomDamping: 0.16,
  cardDamping: 0.18,
  tiltDamping: 0.13,
  dragVelocity: 0.11,
  inertia: 0.86,
  wheelSpeed: 0.022,
  hoverScale: 1.13,
  selectedScale: 1.34,
  inactiveScale: 0.88,
  hoverLift: 1.25,
  selectedLift: 3.55,
  dimOpacity: 0.42,
};
const SCENE_VIEW = {
  standalone: { initialX: 0, initialY: 0, initialZ: 28, minZ: 15, maxZ: 48 },
  home: { initialX: 1.2, initialY: -0.35, initialZ: 25.6, minZ: 14, maxZ: 44 },
};

function FilmWallExperience({ variant = "standalone" }) {
  const isHome = variant === "home";
  const [documentaries, setDocumentaries] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedId, setSelectedId] = useState("");
  const [hoveredId, setHoveredId] = useState("");
  const model = useMemo(() => buildFilmWallModel(documentaries, activeFilter), [documentaries, activeFilter]);
  const selectedFilm = model.films.find((film) => film.id === selectedId) || null;

  useEffect(() => {
    fetch("data/documentaries.json")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(setDocumentaries)
      .catch((error) => console.error("Failed to load film wall data", error));
  }, []);

  useEffect(() => {
    setSelectedId("");
    setHoveredId("");
  }, [activeFilter]);

  return h(
    "div",
    { className: `film-wall-app film-wall-app--${variant}` },
    h(FilmWallScene, {
      variant,
      films: model.films,
      selectedId,
      hoveredId,
      onHover: setHoveredId,
      onSelect: setSelectedId,
    }),
    h(
      "div",
      { className: `wall-chrome wall-chrome--${variant}` },
      isHome
        ? null
        : h(
            "header",
            { className: "wall-header" },
            h("a", { className: "wall-back", href: "index.html" }, "返回片库"),
            h(
              "div",
              null,
              h("p", { className: "wall-kicker" }, "Spatial Film Wall / A-list archive"),
              h("h1", { className: "wall-title" }, "把纪录片当成唱片封套来浏览。"),
              h(
                "p",
                { className: "wall-copy" },
                "拖动不是绕一个模型旋转，而是在一面可移动的影像墙里找线索。点击封面后，影片从墙面中跳出成为档案卡。"
              )
            )
          ),
      isHome
        ? null
        : h(
            "aside",
            { className: "wall-readout" },
            h("strong", null, model.filters.find((item) => item.id === activeFilter)?.label || "全部核心"),
            h("p", null, `${model.films.length} 部影片正在墙面上重新排列。滚轮缩放，拖拽平移，悬停查看焦点。`)
          ),
      h(
        "nav",
        { className: "wall-filter-dock", "aria-label": "影片墙筛选" },
        model.filters.map((filter) =>
          h(
            "button",
            {
              key: filter.id,
              className: "wall-filter",
              type: "button",
              "aria-pressed": filter.id === activeFilter,
              onClick: () => setActiveFilter(filter.id),
            },
            h("small", null, filter.kicker),
            h("strong", null, filter.label),
            h("em", null, filter.count)
          )
        )
      ),
      h(FilmArchiveCard, { film: selectedFilm, onClose: () => setSelectedId("") })
    )
  );
}

function FilmArchiveCard({ film, onClose }) {
  if (!film) return null;
  function openDetail() {
    window.dispatchEvent(new CustomEvent("open-film-detail", { detail: { id: film.id } }));
  }

  return h(
    "aside",
    { className: "film-focus-card" },
    h("button", { className: "film-focus-close", type: "button", "aria-label": "关闭档案卡", onClick: onClose }, "×"),
    h(
      "div",
      { className: "film-focus-layout" },
      h("img", { className: "film-focus-poster", src: film.posterPath, alt: film.posterAlt }),
      h(
        "div",
        { className: "film-focus-copy" },
        h("p", { className: "wall-kicker" }, [film.year, film.publicGradeLabel, film.watch.label].filter(Boolean).join(" / ")),
        h("h2", null, film.title),
        h("p", null, film.secondaryTitle || film.section),
        h(
          "div",
          { className: "film-focus-meta" },
          film.section ? h("span", null, film.section) : null,
          film.directorLine ? h("span", null, film.directorLine) : null,
          h("span", null, `${film.sourceCount} sources`)
        ),
        h(
          "div",
          { className: "film-focus-actions" },
          h("button", { type: "button", onClick: openDetail }, "查看详细档案")
        )
      )
    )
  );
}

function FilmWallScene({ variant = "standalone", films, selectedId, hoveredId, onHover, onSelect }) {
  const canvasRef = useRef(null);
  const filmsRef = useRef(films);
  const selectedRef = useRef(selectedId);
  const hoveredRef = useRef(hoveredId);
  const onHoverRef = useRef(onHover);
  const onSelectRef = useRef(onSelect);
  const needsRebuildRef = useRef(true);
  const view = SCENE_VIEW[variant] || SCENE_VIEW.standalone;

  useEffect(() => {
    filmsRef.current = films;
    needsRebuildRef.current = true;
  }, [films]);

  useEffect(() => {
    selectedRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    hoveredRef.current = hoveredId;
  }, [hoveredId]);

  useEffect(() => {
    onHoverRef.current = onHover;
    onSelectRef.current = onSelect;
  }, [onHover, onSelect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
    camera.position.set(0, 0, view.initialZ);

    const group = new THREE.Group();
    scene.add(group);
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const keyLight = new THREE.DirectionalLight(0xffead1, 1.35);
    keyLight.position.set(-7, 8, 15);
    scene.add(keyLight);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(99, 99);
    const loader = new THREE.TextureLoader();
    const anisotropy = renderer.capabilities.getMaxAnisotropy();
    const pan = {
      active: false,
      moved: false,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      x: view.initialX,
      y: view.initialY,
      targetX: view.initialX,
      targetY: view.initialY,
      vx: 0,
      vy: 0,
      z: view.initialZ,
      targetZ: view.initialZ,
    };
    let filmObjects = [];
    let disposed = false;

    function rebuild() {
      disposeChildren(group);
      group.clear();
      filmObjects = filmsRef.current.map((film) => {
        const object = createPosterObject(film, loader, anisotropy);
        object.position.set(film.wall.x, film.wall.y, film.wall.z);
        object.rotation.z = film.wall.tilt;
        group.add(object);
        return object;
      });
    }

    function resize() {
      const box = canvas.getBoundingClientRect();
      renderer.setSize(box.width, box.height, false);
      camera.aspect = box.width / Math.max(1, box.height);
      camera.updateProjectionMatrix();
    }

    function updatePointer(event) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function pickFilm() {
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(filmObjects, true)[0];
      return hit ? findFilmObject(hit.object) : null;
    }

    function setHoveredFilm(id) {
      if (hoveredRef.current === id) return;
      hoveredRef.current = id;
      onHoverRef.current(id);
    }

    function onPointerDown(event) {
      updatePointer(event);
      pan.active = true;
      pan.moved = false;
      pan.startX = event.clientX;
      pan.startY = event.clientY;
      pan.lastX = event.clientX;
      pan.lastY = event.clientY;
      canvas.classList.add("is-dragging");
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {
        // Older embedded browsers may not support pointer capture reliably.
      }
    }

    function onPointerMove(event) {
      updatePointer(event);
      if (pan.active) {
        const dx = event.clientX - pan.lastX;
        const dy = event.clientY - pan.lastY;
        pan.lastX = event.clientX;
        pan.lastY = event.clientY;
        if (Math.hypot(event.clientX - pan.startX, event.clientY - pan.startY) > 4) pan.moved = true;
        const worldScale = pan.targetZ / 900;
        pan.targetX += dx * worldScale;
        pan.targetY -= dy * worldScale;
        pan.vx = dx * worldScale * MOTION.dragVelocity;
        pan.vy = -dy * worldScale * MOTION.dragVelocity;
        return;
      }

      const hit = pickFilm();
      setHoveredFilm(hit?.userData.id || "");
    }

    function onPointerUp(event) {
      pan.active = false;
      canvas.classList.remove("is-dragging");
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // Older embedded browsers may not support pointer capture reliably.
      }
    }

    function onWheel(event) {
      updatePointer(event);
      const hit = pickFilm();
      if (!hit) return;
      event.preventDefault();
      pan.targetZ = clamp(pan.targetZ + event.deltaY * MOTION.wheelSpeed, view.minZ, view.maxZ);
    }

    function onClick() {
      if (pan.moved) return;
      const hit = pickFilm();
      if (hit) onSelectRef.current(hit.userData.id);
    }

    function animate() {
      if (disposed) return;
      if (needsRebuildRef.current) {
        rebuild();
        needsRebuildRef.current = false;
      }

      if (!pan.active) {
        pan.targetX += pan.vx;
        pan.targetY += pan.vy;
        pan.vx *= MOTION.inertia;
        pan.vy *= MOTION.inertia;
      }
      pan.x += (pan.targetX - pan.x) * MOTION.panDamping;
      pan.y += (pan.targetY - pan.y) * MOTION.panDamping;
      pan.z += (pan.targetZ - pan.z) * MOTION.zoomDamping;
      group.position.set(pan.x, pan.y, 0);
      camera.position.z = pan.z;
      group.rotation.x += (clamp(pan.vy * 1.4, -0.055, 0.055) - group.rotation.x) * MOTION.tiltDamping;
      group.rotation.y += (clamp(-pan.vx * 1.4, -0.075, 0.075) - group.rotation.y) * MOTION.tiltDamping;

      const selected = selectedRef.current;
      const hovered = hoveredRef.current;
      filmObjects.forEach((object) => {
        const isSelected = object.userData.id === selected;
        const isHovered = object.userData.id === hovered;
        const scaleMultiplier = isSelected
          ? MOTION.selectedScale
          : isHovered
            ? MOTION.hoverScale
            : selected
              ? MOTION.inactiveScale
              : 1;
        const targetScale = object.userData.baseScale * scaleMultiplier;
        const targetZ = object.userData.homeZ + (isSelected ? MOTION.selectedLift : isHovered ? MOTION.hoverLift : 0);
        const nextScale = object.scale.x + (targetScale - object.scale.x) * MOTION.cardDamping;
        object.scale.setScalar(nextScale);
        object.position.z += (targetZ - object.position.z) * MOTION.cardDamping;
        object.rotation.x += ((isHovered ? -0.08 : 0) - object.rotation.x) * MOTION.cardDamping;
        object.rotation.y += ((isHovered ? pointer.x * 0.16 : 0) - object.rotation.y) * MOTION.cardDamping;
        object.userData.posterMaterial.opacity +=
          ((selected && !isSelected ? MOTION.dimOpacity : 1) - object.userData.posterMaterial.opacity) * MOTION.cardDamping;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("pointerleave", () => setHoveredFilm(""));

    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("click", onClick);
      disposeChildren(group);
      renderer.dispose();
    };
  }, [view]);

  return h("canvas", { ref: canvasRef, className: "wall-canvas", "aria-label": "空间化纪录片封面墙" });
}

function createPosterObject(film, loader, anisotropy) {
  const group = new THREE.Group();
  const baseScale = film.wall.scale || 1;
  group.userData = {
    id: film.id,
    baseScale,
    homeZ: film.wall.z,
  };

  const backing = new THREE.Mesh(
    new THREE.BoxGeometry(CARD.width + 0.18, CARD.height + 0.24, 0.1),
    new THREE.MeshStandardMaterial({
      color: 0xf7efe0,
      roughness: 0.66,
      metalness: 0.03,
    })
  );
  backing.position.z = -0.06;
  backing.userData.id = film.id;
  group.add(backing);

  const posterMaterial = new THREE.MeshBasicMaterial({
    color: 0xd8c8aa,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
  });
  const poster = new THREE.Mesh(new THREE.PlaneGeometry(CARD.width, CARD.height), posterMaterial);
  poster.position.z = 0.015;
  poster.userData.id = film.id;
  group.userData.posterMaterial = posterMaterial;
  group.add(poster);

  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(backing.geometry),
    new THREE.LineBasicMaterial({
      color: film.gradeCode === "S" ? 0xff5a35 : 0xf7efe0,
      transparent: true,
      opacity: film.gradeCode === "S" ? 0.8 : 0.42,
    })
  );
  edge.position.copy(backing.position);
  edge.userData.id = film.id;
  group.add(edge);

  loader.load(
    film.posterPath,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = anisotropy;
      posterMaterial.map = texture;
      posterMaterial.color.set(0xffffff);
      posterMaterial.needsUpdate = true;
    },
    undefined,
    () => {
      posterMaterial.color.set(0x2a2520);
    }
  );

  group.scale.setScalar(baseScale);
  return group;
}

function findFilmObject(object) {
  let current = object;
  while (current) {
    if (current.userData?.posterMaterial) return current;
    current = current.parent;
  }
  return null;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function disposeChildren(object) {
  object.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.filter(Boolean).forEach((material) => {
      if (material.map) material.map.dispose();
      material.dispose();
    });
  });
}

mountFilmWall("#film-wall-root", "standalone");
mountFilmWall("#home-film-wall-root", "home");

function mountFilmWall(selector, variant) {
  const root = document.querySelector(selector);
  if (!root) return;
  createRoot(root).render(h(FilmWallExperience, { variant }));
}

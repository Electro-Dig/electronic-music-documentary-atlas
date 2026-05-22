import React, { useEffect, useMemo, useRef, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import * as THREE from "https://esm.sh/three@0.165.0";
import { buildGraphModel } from "./graph-data.js";

const h = React.createElement;
const TYPE_COLORS = {
  film: 0xe64b2e,
  city: 0x2f8f98,
  technology: 0xb6d82f,
  genre: 0x273f88,
  person: 0x181714,
};
const FILM_CARD = { width: 3.05, height: 4.35 };

function PatchCableLab() {
  const [documentaries, setDocumentaries] = useState([]);
  const [activePathId, setActivePathId] = useState("dancefloor-formation");
  const [selectedId, setSelectedId] = useState(null);
  const model = useMemo(() => buildGraphModel(documentaries), [documentaries]);
  const activePath = model.paths.find((path) => path.id === activePathId) || model.paths[0];
  const graph = activePath ? model.byPath[activePath.id] : { nodes: [], edges: [] };
  const selected = graph.nodes.find((node) => node.id === selectedId) || null;

  useEffect(() => {
    fetch("data/documentaries.json")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(setDocumentaries)
      .catch((error) => console.error("Failed to load documentary data", error));
  }, []);

  useEffect(() => {
    setSelectedId(null);
  }, [activePathId]);

  return h(
    "div",
    { className: "lab-app" },
    h(
      "aside",
      { className: "lab-panel" },
      h("a", { className: "lab-back", href: "index.html" }, "返回片库"),
      h(
        "header",
        null,
        h("p", { className: "eyebrow" }, "Patch Cable Lab"),
        h("h1", { className: "lab-title" }, "用线缆重新接入电子音乐纪录片。"),
        h(
          "p",
          { className: "lab-copy" },
          "这是 React + Three.js 实验层：影片以封面卡片进入空间，城市、技术、流派和人物退到背后的接线点，形成一条可探索的声音线路。"
        )
      ),
      h(
        "div",
        { className: "path-list", "aria-label": "策展路径" },
        model.paths.map((path) =>
          h(
            "button",
            {
              key: path.id,
              className: "path-button",
              type: "button",
              "aria-pressed": path.id === activePathId,
              onClick: () => setActivePathId(path.id),
            },
            h("small", null, path.kicker),
            h("strong", null, path.title)
          )
        )
      )
    ),
    h(
      "main",
      { className: "lab-stage" },
      h(PatchCableScene, { graph, selectedId: selected?.id || "", onSelect: setSelectedId }),
      h(SceneFloatingDetail, { node: selected, graph, onClose: () => setSelectedId(null) }),
      h(
        "div",
        { className: "scene-hud" },
        h("strong", null, activePath?.title || "Loading"),
        h("span", null, activePath?.description || "正在加载关系图谱。"),
        h(
          "div",
          { className: "scene-legend", "aria-label": "节点类型图例" },
          h("span", { style: { "--dot": "#e64b2e" } }, "封面卡"),
          h("span", { style: { "--dot": "#2f8f98" } }, "城市"),
          h("span", { style: { "--dot": "#b6d82f" } }, "技术"),
          h("span", { style: { "--dot": "#273f88" } }, "流派"),
          h("span", { style: { "--dot": "#181714" } }, "人物")
        )
      )
    )
  );
}

function SceneFloatingDetail({ node, graph, onClose }) {
  if (!node) return null;

  const linked = graph.edges.filter((edge) => edge.source === node.id || edge.target === node.id).length;
  return h(
    "aside",
    { className: "scene-detail" },
    h(
      "button",
      {
        className: "scene-detail-close",
        type: "button",
        "aria-label": "关闭浮窗",
        onClick: onClose,
      },
      "×"
    ),
    h(
      "div",
      { className: "scene-detail-main" },
      node.type === "film" && node.posterPath
        ? h("img", { className: "scene-detail-poster", src: node.posterPath, alt: node.posterAlt || node.label })
        : h("div", { className: "scene-detail-orb", style: { "--orb": colorForType(node.type) } }),
      h(
        "div",
        { className: "scene-detail-copy" },
        h("p", { className: "eyebrow" }, node.type),
        h("h2", null, node.label),
        h("p", null, node.subtitle || `${linked} 条连接`),
        h(
          "div",
          { className: "lab-tags" },
          h("span", { className: "tag" }, `${linked} connections`),
          node.gradeCode ? h("span", { className: "tag" }, `Grade ${node.gradeCode}`) : null,
          node.year ? h("span", { className: "tag" }, String(node.year)) : null
        )
      )
    )
  );
}

function colorForType(type) {
  const value = TYPE_COLORS[type] || 0x675f53;
  return `#${value.toString(16).padStart(6, "0")}`;
}

function PatchCableScene({ graph, selectedId, onSelect }) {
  const canvasRef = useRef(null);
  const graphRef = useRef(graph);
  const selectRef = useRef(onSelect);
  const selectedRef = useRef(selectedId);
  const needsRebuildRef = useRef(true);

  useEffect(() => {
    graphRef.current = graph;
    needsRebuildRef.current = true;
  }, [graph]);

  useEffect(() => {
    selectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    selectedRef.current = selectedId;
    needsRebuildRef.current = true;
  }, [selectedId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 42);

    const group = new THREE.Group();
    scene.add(group);
    scene.add(new THREE.AmbientLight(0xffffff, 1.35));
    const keyLight = new THREE.DirectionalLight(0xfff4dd, 1.1);
    keyLight.position.set(-8, 11, 16);
    scene.add(keyLight);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const clock = new THREE.Clock();
    const textureLoader = new THREE.TextureLoader();
    const textureAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const dragState = {
      active: false,
      moved: false,
      lastX: 0,
      lastY: 0,
      startX: 0,
      startY: 0,
      rotationX: -0.04,
      rotationY: 0,
      targetRotationX: -0.04,
      targetRotationY: 0,
      velocityX: 0,
      velocityY: 0,
      targetCameraZ: 42,
    };
    let nodeObjects = [];
    let disposed = false;

    function rebuild() {
      disposeChildren(group);
      group.clear();
      nodeObjects = [];
      const layout = layoutGraph(graphRef.current);
      const nodeMap = new Map(layout.nodes.map((node) => [node.id, node]));

      layout.edges.forEach((edge) => {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target) return;
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(source.x, source.y, source.z),
          new THREE.Vector3(target.x, target.y, target.z),
        ]);
        const material = new THREE.LineBasicMaterial({
          color: 0x675f53,
          transparent: true,
          opacity: 0.24,
        });
        group.add(new THREE.Line(geometry, material));
      });

      layout.nodes.forEach((node) => {
        const object =
          node.type === "film"
            ? createFilmCard(node, textureLoader, node.id === selectedRef.current, textureAnisotropy)
            : createConnectorNode(node, node.id === selectedRef.current);
        object.position.set(node.x, node.y, node.z);
        object.rotation.z = node.tilt || 0;
        nodeObjects.push(object);
        group.add(object);
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

    function onPointerDown(event) {
      updatePointer(event);
      dragState.active = true;
      dragState.moved = false;
      dragState.startX = event.clientX;
      dragState.startY = event.clientY;
      dragState.lastX = event.clientX;
      dragState.lastY = event.clientY;
      canvas.classList.add("is-dragging");
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture can fail in older embedded browsers.
      }
    }

    function onPointerMove(event) {
      updatePointer(event);
      if (!dragState.active) return;

      const dx = event.clientX - dragState.lastX;
      const dy = event.clientY - dragState.lastY;
      dragState.lastX = event.clientX;
      dragState.lastY = event.clientY;
      if (Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY) > 4) {
        dragState.moved = true;
      }

      dragState.targetRotationY += dx * 0.0065;
      dragState.targetRotationX = clamp(dragState.targetRotationX + dy * 0.0045, -0.58, 0.58);
      dragState.velocityY = dx * 0.0008;
      dragState.velocityX = dy * 0.00055;
    }

    function onPointerUp(event) {
      dragState.active = false;
      canvas.classList.remove("is-dragging");
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture can fail in older embedded browsers.
      }
    }

    function onWheel(event) {
      event.preventDefault();
      dragState.targetCameraZ = clamp(dragState.targetCameraZ + event.deltaY * 0.025, 24, 62);
    }

    function onClick() {
      if (dragState.moved) return;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(nodeObjects, true)[0];
      const id = hit ? findObjectId(hit.object) : "";
      if (id) selectRef.current(id);
    }

    function animate() {
      if (disposed) return;
      if (needsRebuildRef.current) {
        rebuild();
        needsRebuildRef.current = false;
      }

      const t = clock.getElapsedTime();
      if (!dragState.active) {
        dragState.targetRotationY += dragState.velocityY;
        dragState.targetRotationX = clamp(dragState.targetRotationX + dragState.velocityX, -0.58, 0.58);
        dragState.velocityX *= 0.92;
        dragState.velocityY *= 0.92;
      }

      dragState.rotationX += (dragState.targetRotationX - dragState.rotationX) * 0.12;
      dragState.rotationY += (dragState.targetRotationY - dragState.rotationY) * 0.12;
      camera.position.z += (dragState.targetCameraZ - camera.position.z) * 0.14;

      group.rotation.y = dragState.rotationY + (dragState.active ? 0 : Math.sin(t * 0.1) * 0.035);
      group.rotation.x = dragState.rotationX + (dragState.active ? 0 : Math.cos(t * 0.11) * 0.018);
      group.position.y = Math.sin(t * 0.22) * 0.16;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    resize();
    needsRebuildRef.current = true;
    animate();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("click", onClick);

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
  }, []);

  return h("canvas", { ref: canvasRef, className: "lab-canvas", "aria-label": "三维关系图谱" });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function layoutGraph(graph) {
  const nodes = graph.nodes || [];
  const edges = graph.edges || [];
  const byType = groupBy(nodes, "type");
  const positioned = [];

  const films = byType.get("film") || [];
  const filmSpan = Math.min(29, Math.max(14, films.length * 2.1));
  films.forEach((node, index) => {
    const normalized = films.length <= 1 ? 0 : index / (films.length - 1) - 0.5;
    const lane = index % 2 === 0 ? 1 : -1;
    positioned.push({
      ...node,
      x: normalized * filmSpan,
      y: lane * 2.7 + Math.sin(index * 0.73) * 1.15,
      z: 1.8 + ((index % 5) - 2) * 0.85,
      tilt: Math.sin(index * 1.37) * 0.09,
    });
  });

  ["city", "technology", "genre", "person"].forEach((type, typeIndex) => {
    const group = byType.get(type) || [];
    const radius = 6.2 + typeIndex * 2.2;
    group.forEach((node, index) => {
      const angle = (index / Math.max(1, group.length)) * Math.PI * 2 + typeIndex * 0.54;
      positioned.push({
        ...node,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius * 0.44 - 1.2,
        z: -5.5 - typeIndex * 1.3 + (index % 3) * 0.5,
      });
    });
  });

  return { nodes: positioned, edges };
}

function createFilmCard(node, textureLoader, selected, anisotropy) {
  const card = new THREE.Group();
  card.userData = { id: node.id, type: node.type };

  const baseMaterial = new THREE.MeshStandardMaterial({
    color: selected ? 0x171512 : 0xfffbf2,
    roughness: 0.78,
    metalness: 0.04,
  });
  const base = new THREE.Mesh(new THREE.BoxGeometry(FILM_CARD.width + 0.26, FILM_CARD.height + 0.3, 0.18), baseMaterial);
  base.position.z = -0.05;
  base.userData = card.userData;
  card.add(base);

  const posterMaterial = new THREE.MeshBasicMaterial({
    color: 0xf6ead7,
    side: THREE.DoubleSide,
  });
  const poster = new THREE.Mesh(new THREE.PlaneGeometry(FILM_CARD.width, FILM_CARD.height), posterMaterial);
  poster.position.z = 0.06;
  poster.userData = card.userData;
  card.add(poster);

  const frame = new THREE.LineSegments(
    new THREE.EdgesGeometry(base.geometry),
    new THREE.LineBasicMaterial({
      color: selected ? 0xff4d2a : 0x5b5348,
      transparent: true,
      opacity: selected ? 0.95 : 0.5,
    }),
  );
  frame.position.copy(base.position);
  frame.userData = card.userData;
  card.add(frame);

  if (node.posterPath) {
    textureLoader.load(
      node.posterPath,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = anisotropy;
        posterMaterial.map = texture;
        posterMaterial.color.set(0xffffff);
        posterMaterial.needsUpdate = true;
      },
      undefined,
      () => {
        posterMaterial.color.set(0xeadac0);
      },
    );
  }

  const scale = selected ? 1.18 : node.gradeCode === "S" ? 1.06 : 1;
  card.scale.setScalar(scale);
  return card;
}

function createConnectorNode(node, selected) {
  const radius = selected ? 0.54 : 0.34 + Math.min(node.weight || 1, 8) * 0.025;
  const material = new THREE.MeshStandardMaterial({
    color: TYPE_COLORS[node.type] || 0x675f53,
    roughness: 0.55,
    metalness: node.type === "technology" ? 0.3 : 0.08,
    emissive: selected ? 0x22170c : 0x000000,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 26, 18), material);
  mesh.userData = { id: node.id, type: node.type };
  return mesh;
}

function findObjectId(object) {
  let current = object;
  while (current) {
    if (current.userData?.id) return current.userData.id;
    current = current.parent;
  }
  return "";
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

function groupBy(items, key) {
  const groups = new Map();
  items.forEach((item) => {
    const value = item[key] || "unknown";
    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push(item);
  });
  return groups;
}

createRoot(document.querySelector("#patch-cable-root")).render(h(PatchCableLab));

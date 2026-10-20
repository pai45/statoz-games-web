import * as THREE from 'three';
import type { AssetManifest, Pose, View } from './contracts';
import { project, goalProject, goalSpace } from './geometry';
import type { Simulation } from './simulation';
import {VIEW} from './presentation';
import {drawStadium} from './stadium';
export class FootballRenderer {
    private viewportWidth:number=VIEW.width;
    resize(width:number){this.viewportWidth=width;this.gl.setSize(width,VIEW.height,false);}
    readonly gl: THREE.WebGLRenderer;
    private scene = new THREE.Scene();
    private pitch = new THREE.Group();
    private camera = new THREE.OrthographicCamera(0, 320, 0, -224, .1, 200);
    private texture: THREE.Texture;
    private poses: Map<string, Pose>;
    private actors = new Map<number, THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>();
    private decorations = new Map<number, {
        marker: THREE.Mesh;
        shadow: THREE.Mesh;
        selection: THREE.Mesh;
    }>();
    private meshes: THREE.Mesh[] = [];
    private ball = new THREE.Group();
    private ballShadow: THREE.Mesh;
    private close = new THREE.Group();
    private net = new THREE.Group();
    private closeKeeper!: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
    private target = new THREE.Group();
    private closeShadow!: THREE.Mesh;
    private closeMarker!: THREE.Mesh;
    private disposed = false;
    private selectionLabel=new THREE.Group();
    constructor(canvas: HTMLCanvasElement, readonly assets: AssetManifest, image: HTMLImageElement) {
        this.gl = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, preserveDrawingBuffer: true, powerPreference: 'low-power' });
        this.gl.setPixelRatio(1);
        this.gl.setSize(VIEW.width, VIEW.height, false);
        this.gl.outputColorSpace = THREE.SRGBColorSpace;
        this.gl.setClearColor('#0f172b');
        this.camera.position.z = 100;
        this.scene.add(this.pitch, this.close, this.ball);
        this.poses = new Map(assets.records.map(r => [r.id, r]));
        this.texture = new THREE.Texture(image);
        this.texture.colorSpace = THREE.SRGBColorSpace;
        this.texture.minFilter = THREE.NearestFilter;
        this.texture.magFilter = THREE.NearestFilter;
        this.texture.generateMipmaps = false;
        this.texture.needsUpdate = true;
        drawStadium(this.pitch,this.rect.bind(this),this.box.bind(this));
        this.batchStatic(this.pitch);
        this.pitch.add(this.selectionLabel);
        for(const [index,glyph]of [['110','101','110','100','100'],['010','110','010','010','111']].entries())for(let y=0;y<5;y++)for(let x=0;x<3;x++)if(glyph[y][x]==='1')this.rect(this.selectionLabel,index*4+x-3,y-88,1,1,'#ffffff',8002);
        for (let id = 0; id < 22; id++) {
            const actor = this.makeSprite();
            this.actors.set(id, actor);
            this.pitch.add(actor);
            const marker = this.rect(this.pitch, 0, 0, 10, 2, id < 11 ? '#5cdfff' : '#ef6758', 1), shadow = new THREE.Mesh(new THREE.CircleGeometry(1, 12), new THREE.MeshBasicMaterial({ color: '#102318', transparent: true, depthTest: false, depthWrite: false }));
            shadow.scale.set(8, 2, 1);
            this.pitch.add(shadow);
            this.meshes.push(shadow);
            const triangle = new THREE.BufferGeometry();
            triangle.setAttribute('position', new THREE.Float32BufferAttribute([-4, 80, 0, 0, 74, 0, 4, 80, 0], 3));
            const selection = new THREE.Mesh(triangle, new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide, transparent: true, depthTest: false, depthWrite: false }));
            this.pitch.add(selection);
            this.meshes.push(selection);
            this.decorations.set(id, { marker, shadow, selection });
        }
        drawStadium(this.close,this.rect.bind(this),this.box.bind(this),true);
        this.batchStatic(this.close);
        this.close.add(this.net, this.target);
        this.rect(this.net, 48, 59, 224, 74, '#112322', -50);
        for (let x = 48; x <= 272; x += 8)
            this.rect(this.net, x, 61, 1, 71, '#cad5e2', -49);
        for (let y = 61; y <= 132; y += 7)
            this.rect(this.net, 48, y, 224, 1, '#cad5e2', -49);
        this.box(this.net, 48, 58, 224, 75, '#ffffff');
        this.batchStatic(this.net);
        this.closeKeeper = this.makeSprite();
        this.close.add(this.closeKeeper);
        this.closeMarker = this.rect(this.close, 0, 0, 10, 2, '#5cdfff', 1);
        this.closeShadow = this.rect(this.close, 0, 0, 7, 2, '#162536', 9000);
        this.rect(this.target, -12, 0, 25, 1, '#5cdfff', 10010);
        this.rect(this.target, 0, -12, 1, 25, '#5cdfff', 10010);
        this.ballShadow = this.rect(this.pitch, 0, 0, 6, 2, '#162536', 9000);
        this.rect(this.ball, -3, -3, 7, 7, '#081019', 10000);
        this.rect(this.ball, -2, -2, 5, 5, '#ffffff', 10001);
        this.rect(this.ball, -1, -1, 2, 2, '#1a253a', 10002);
    }
    private rect(group: THREE.Group, x: number, y: number, w: number, h: number, color: string, order: number) { const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color, transparent: order > 0, depthTest: false, depthWrite: false })); mesh.position.set(x + w / 2, -y - h / 2, 0); mesh.renderOrder = order; group.add(mesh); this.meshes.push(mesh); return mesh; }
    private box(group: THREE.Group, x: number, y: number, w: number, h: number, color: string, t = 1) { this.rect(group, x, y, w, t, color, -40); this.rect(group, x, y + h - t, w, t, color, -40); this.rect(group, x, y, t, h, color, -40); this.rect(group, x + w - t, y, t, h, color, -40); }
    private makeSprite() { const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, alphaTest: .01, depthTest: false, depthWrite: false })); this.meshes.push(mesh); return mesh; }
    private batchStatic(group: THREE.Group) {
        const candidates = group.children.filter(m => m instanceof THREE.Mesh && m.renderOrder < 0) as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[];
        candidates.sort((a, b) => a.renderOrder - b.renderOrder);
        const positions: number[] = [], colors: number[] = [];
        for (const m of candidates) {
            m.updateMatrix();
            const geometry = m.geometry.toNonIndexed(), attribute = geometry.getAttribute('position');
            for (let n = 0; n < attribute.count; n++) {
                const v = new THREE.Vector3().fromBufferAttribute(attribute, n).applyMatrix4(m.matrix);
                positions.push(v.x, v.y, v.z);
                colors.push(m.material.color.r, m.material.color.g, m.material.color.b);
            }
            geometry.dispose();
            m.geometry.dispose();
            m.material.dispose();
            group.remove(m);
        }
        const removed = new Set<THREE.Mesh>(candidates);
        this.meshes = this.meshes.filter(m => !removed.has(m));
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        const batch = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ vertexColors: true, depthTest: false, depthWrite: false }));
        batch.renderOrder = -50;
        group.add(batch);
        this.meshes.push(batch);
    }
    private show(mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>, x: number, y: number, v: View, order: number) {
        const pose = this.poses.get(v.pose);
        if (!pose)
            throw new Error('Missing atlas pose ' + v.pose);
        const g = pose.anchors.ground, [ax, ay, w, h] = pose.atlas, [aw, ah] = this.assets.atlasSize;
        const uv = mesh.geometry.getAttribute('uv') as THREE.BufferAttribute;
        uv.setXY(0, ax / aw, 1 - ay / ah);
        uv.setXY(1, (ax + w) / aw, 1 - ay / ah);
        uv.setXY(2, ax / aw, 1 - (ay + h) / ah);
        uv.setXY(3, (ax + w) / aw, 1 - (ay + h) / ah);
        uv.needsUpdate = true;
        mesh.scale.set(v.mirror ? -w : w, h, 1);
        mesh.position.set(Math.round(x) + (v.mirror ? g[0] - w / 2 : w / 2 - g[0]), -(Math.round(y) + h / 2 - g[1]), 0);
        mesh.renderOrder = order;
        mesh.visible = true;
    }
    render(sim: Simulation) {
        if (this.disposed)
            return;
        const s = sim.state, v = s.shotView;
        this.pitch.visible = !v;
        this.close.visible = !!v;
        if (v) {
            this.camera.left = 160-this.viewportWidth/2;
            this.camera.right = 160+this.viewportWidth/2;
            this.camera.top = 0;
            this.camera.bottom = -224;
            this.camera.updateProjectionMatrix();
            const keeper = s.players[v.keeper], q = goalSpace({ ...keeper, z: 0 }, v), b = goalProject(s.ball, v), ground = goalSpace(s.ball, v);
            this.net.position.y = -(v.planeY - 133);
            this.show(this.closeKeeper, q.x, q.y, sim.view(keeper), 151);
            this.closeMarker.position.set(q.x, -q.y - 5, 0);
            this.closeMarker.renderOrder = 152;
            if(this.closeMarker.material instanceof THREE.MeshBasicMaterial)this.closeMarker.material.color.set(keeper.team === 0 ? '#5cdfff' : '#ef6758');
            this.target.visible = v.phase === 'aim';
            this.target.position.set(v.aim.x, -v.aim.y, 0);
            this.ball.position.set(Math.round(b.x), -Math.round(b.y), 0);
            this.closeShadow.visible = s.ball.z > 3;
            this.closeShadow.position.set(Math.round(ground.x), -Math.round(ground.y), 0);
            this.gl.render(this.scene, this.camera);
            return;
        }
        for (const mesh of this.actors.values())
            mesh.visible = false;
        for (const d of this.decorations.values()) {
            d.marker.visible = false;
            d.shadow.visible = false;
            d.selection.visible = false;
        }
        for (const p of s.players) {
            const q = project(p), x = Math.round(q.x), y = Math.round(q.y);
            this.show(this.actors.get(p.id)!, q.x, q.y, sim.view(p), y);
            const d = this.decorations.get(p.id)!;
            d.marker.visible = true;
            d.shadow.visible = true;
            d.marker.position.set(x, -y - 5, 0);
            d.marker.renderOrder = y + .1;
            d.shadow.position.set(x, -y - 2, 0);
            d.shadow.renderOrder = y - .1;
            d.selection.visible = p.id === s.selected;
            d.selection.position.set(x, -y, 0);
            d.selection.renderOrder = 8000;
        }
        const b = project(s.ball);
        const selected=project(s.players[s.selected]);this.selectionLabel.position.set(Math.round(selected.x),-Math.round(selected.y),0);
        this.ball.position.set(Math.round(b.x), -Math.round(b.y - s.ball.z), 0);
        this.ballShadow.visible = s.ball.z > 3;
        this.ballShadow.position.set(Math.round(b.x), -Math.round(b.y), 0);
        this.camera.left = s.camera.x;
        this.camera.right = s.camera.x + this.viewportWidth;
        this.camera.top = -s.camera.y;
        this.camera.bottom = -s.camera.y - 224;
        this.camera.updateProjectionMatrix();
        this.gl.render(this.scene, this.camera);
    }
    diagnostics() { return { disposed: this.disposed, geometries: this.gl.info.memory.geometries, textures: this.gl.info.memory.textures, drawCalls: this.gl.info.render.calls }; }
    dispose() {
        if (this.disposed)
            return;
        this.disposed = true;
        for (const m of this.meshes) {
            m.geometry.dispose();
            const material = m.material;
            if (Array.isArray(material))
                material.forEach(v => v.dispose());
            else
                material.dispose();
        }
        this.texture.dispose();
        this.scene.clear();
        this.actors.clear();
        this.gl.renderLists.dispose();
        this.gl.dispose();
        this.gl.forceContextLoss();
    }
}

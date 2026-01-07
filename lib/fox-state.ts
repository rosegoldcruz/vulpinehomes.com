import * as THREE from "three";

export type FoxState =
  | "idle"
  | "greet"
  | "listen"
  | "respond"
  | "walk"
  | "guide"
  | "point"
  | "look_at_user";

export class FoxController {
  fox: THREE.Object3D | null = null;
  mixer: THREE.AnimationMixer | null = null;
  actions: Record<string, THREE.AnimationAction> = {};
  state: FoxState = "idle";
  target: THREE.Vector3 | null = null;
  userPos: THREE.Vector3 = new THREE.Vector3();

  setModel(model: THREE.Object3D, animations: THREE.AnimationClip[]) {
    this.fox = model;
    this.mixer = new THREE.AnimationMixer(model);

    animations.forEach((clip) => {
      this.actions[clip.name] = this.mixer!.clipAction(clip);
    });

    this.play("Idle");
    this.state = "idle";
  }

  play(name: string) {
    Object.values(this.actions).forEach((a) => a.stop());
    if (this.actions[name]) this.actions[name].play();
  }

  setState(newState: FoxState) {
    this.state = newState;

    switch (newState) {
      case "idle":
        this.play("Idle");
        break;
      case "greet":
        this.play("Wave");
        break;
      case "listen":
        this.play("Listen");
        break;
      case "respond":
        this.play("Talk");
        break;
      case "walk":
        this.play("Walk");
        break;
      case "guide":
        this.play("Guide");
        break;
      case "point":
        this.play("Point");
        break;
      case "look_at_user":
        this.play("Idle");
        break;
    }
  }

  setWalkTarget(vec: THREE.Vector3) {
    this.target = vec.clone();
    this.setState("walk");
  }

  update(delta: number) {
    this.mixer?.update(delta);

    if (!this.fox) return;

    if (this.state === "look_at_user") {
      this.fox.lookAt(this.userPos);
    }

    if (this.state === "walk" && this.target) {
      const dir = new THREE.Vector3().subVectors(this.target, this.fox.position);
      const dist = dir.length();
      const speed = 0.6;

      if (dist > 0.02) {
        dir.normalize();
        this.fox.position.add(dir.multiplyScalar(speed * delta));
        this.fox.lookAt(this.target);
      } else {
        this.setState("respond");
      }
    }
  }
}

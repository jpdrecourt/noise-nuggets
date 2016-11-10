/*
 * 2D shapes created out of THREE  meshes
 */

const THREE = require('three');

/*
 * Creates a square centered on a given position and with a given size
 * new square(position, size [, material])
 * size: float in pixels
 * position: THREE.Vector3 object, defaults to new Vector3(0,0,0);
 * material: THREE material object, defaults to MeshBasicMaterial({ color: 0xffffff })
 *
 * Methods:
 * addTo(scene) : adds the square to a THREE scene
 */

class square {
  constructor(size, position, material) {
    this._size = size;
    this._material = material ||
      new THREE.MeshBasicMaterial({ color: 0xffffff });
    // Create the geometry
    let geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3(-size/2, size/2, 0.0),
      new THREE.Vector3(size/2, size/2, 0.0),
      new THREE.Vector3(size/2, -size/2, 0.0),
      new THREE.Vector3(-size/2, -size/2, 0.0));
    geometry.faces.push(
      new THREE.Face3(0, 2, 1),
      new THREE.Face3(0, 3, 2));
    this._mesh = new THREE.Mesh(geometry, this._material);
    if (position) this._mesh.position.set(position.x, position.y, position.z);
  }
  // Getters
  get size()      {return this._size;}
  get position()  {return this._mesh.position;}
  get material()  {return this._material;}
  get mesh()      {return this._mesh;}
  get colorHex()  {return this._material.color.getHex();}
  // Setters
  set position(value) {
    this.mesh.position.set = (value.x, value.y, value.z);
  }
  set colorHex(value) {
    this.material.color.setHex(value);
  }
  set material(value) {
    this.material = value;
  }
  // Adds the square to a THREE scene
  addTo(scene) {
    scene.add(this.mesh);
  }
}

class line {

}

module.exports.square = square;
module.exports.line = line;

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

/*
 * Creates a straight line with a beginning and an end
 * constructor:
 * line(start, end, material)
 * start: starting point as a THREE Vector3
 * end: end point as a THREE Vector3
 * material: THREE LineMaterial default to LineBasicMaterial({ color: 0xffffff })
 *
 * Method:
 * addTo(scene): adds the line to a THREE scene
 */
class line {
  constructor(start, end, material) {
    this._material = material ||
      new THREE.LineBasicMaterial({ color: 0xffffff });
    let geometry = new THREE.Geometry();
    geometry.vertices.push(start, end);
    this._mesh = new THREE.Line( geometry, this._material );
  }
  // Getters
  get start()     {
    // Allow for update of the line if the vector is changed
    this.mesh.geometry.verticesNeedUpdate = true;
    return this.mesh.geometry.vertices[0];}
  get end()       {
    // Allow for update of the line if the vector is changed
    this.mesh.geometry.verticesNeedUpdate = true;
    return this.mesh.geometry.vertices[1];}
  get material()  {return this._material;}
  get mesh()      {return this._mesh;}
  get colorHex()  {return this._material.color.getHex();}
  // Setters
  set colorHex(value) {
    this.material.color.setHex(value);
  }
  set material(value) {
    this.material = value;
  }
  // Adds the line to a THREE scene
  addTo(scene) {
    scene.add(this.mesh);
  }
}

module.exports.square = square;
module.exports.line = line;

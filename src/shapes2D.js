/*
 * 2D shapes created out of THREE  meshes
 */
const THREE = require('three');
class Shape2D {
  constructor(material) {
    this._material = material ||
      new THREE.MeshBasicMaterial({ color: 0xffffff });
    this._mesh = undefined;
  }
  // Getters
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
  // Adds the shape to a THREE scene
  addTo(scene) {
    scene.add(this.mesh);
  }
}

/*
 * Creates a square centered on a given position and with a given size
 * new Square(position, size [, material])
 * size: float in pixels
 * position: THREE.Vector3 object or object with {x, y, z} properties;
 * material: THREE material object, defaults to MeshBasicMaterial({ color: 0xffffff })
 *
 * Methods:
 * addTo(scene) : adds the square to a THREE scene
 */
class Square extends Shape2D {
  constructor(size, position, material) {
    super(material);
    this._size = size;
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
}
/*
 * Creates a straight line with a beginning and an end
 * constructor:
 * line(start, end, material)
 * start: starting point as an object with (x, y, z) properties array of coordinates
 * end: end point as a THREE Vector3
 * material: THREE LineMaterial default to LineBasicMaterial({ color: 0xffffff })
 *
 * Method:
 * addTo(scene): adds the line to a THREE scene
 */
class Line extends Shape2D {
  constructor(start, end, material) {
    super(material);
    let geometry = new THREE.Geometry();
    let startVec = new THREE.Vector3(start.x, start.y, start.z);
    let endVec = new THREE.Vector3(end.x, end.y, end.z);
    geometry.vertices.push(startVec, endVec);
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
    return this.mesh.geometry.vertices[1];
  }
}
/*
 * Bracket
 * TODO Doc
 */
class Bracket extends Shape2D {
  constructor(position, height, rotation, material) {
    super(material);
    let geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3(height/3, -height/2, 0),
      new THREE.Vector3(0, - height/2, 0),
      new THREE.Vector3(0, height/2, 0),
      new THREE.Vector3(height/3, height/2, 0)
    );
    let bracket =  new THREE.Line( geometry, this._material);
    bracket.rotation.z = rotation || 0;
    this._mesh = new THREE.Object3D();
    this._mesh.add(bracket);
    this._mesh.position.set(position.x, position.y, position.z);
    // Getters
  }
  get position() {
    return this._mesh.position;
  }
}

module.exports.Square = Square;
module.exports.Line = Line;
module.exports.Bracket = Bracket;

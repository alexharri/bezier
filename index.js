const mainContainer = document.getElementById("main-container");
const pointContainer = document.getElementById("point-container");
const ctxHeight = 800;
const ctxWidth = 800;

const _mouseMoveExecutionQueue = [];

function callMouseMoveExecutionQueue(position) {

}

const shortid = () => Math.random().toString();

function calcDistanceBetweenPoints(a, b) {
  const dX = Math.abs(a.x - b.x); // difference on x axis
  const dY = Math.abs(a.y - b.y); // difference on y axis
  return (dX * dX) + (dY * dY); // shoutout pythagoras
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function renderCircle(points, radius, color) {
  if (!Array.isArray(points)) {
    points = [points];
  }
  
  ctx.fillStyle = color;
  for (let i = 0; i < points.length; i += 1) {
    const { x, y } = points[i];
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
  }
}

const toConnectionId = (a, b) => ([a, b].sort().join("-"));

const a = shortid();
const b = shortid();
const c = shortid();

const points = {
  [a]: {
    x: 40,
    y: 40,
  },
  [b]: {
    x: 400,
    y: 200,
  },
};

const connections = {
  [toConnectionId(a, b)]: {
    id: toConnectionId(a, b),
    points: [a, b],
    handles: [
      { x: 240, y: 20 },
      { x: 360, y: 500 },
    ],
  },
};

function getConnectionById(a, b) {
  return connections[toConnectionId(a, b)] || null;
}

/**
 * a and b are any numbers.
 * t should be a number between 0 and 1
 */
const getIntermediateNumber = (a, b, t) => (a * (1 - t)) + (b * t);

const getMainRect = () => mainContainer.getBoundingClientRect();
const getLeftOffset = () => getMainRect().left;
const getTopOffset  = () => getMainRect().top;

function getPointById(id) {
  return points[id] || null;
}

const renderPoint = point => renderCircle(point, 8, "blue");

function renderPoints() {
  const keys = Object.keys(points);
  for (let i = 0; i < keys.length; i += 1) {
    renderPoint(points[keys[i]]);
  }
}

function renderConnections() {
  const keys = Object.keys(connections);
  for (let i = 0; i < keys.length; i += 1) {
    const [ p0, p1, p2, p3 ] = getConnectionPoints(connections[keys[i]]);
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.bezierCurveTo(
      (p1.x), (p1.y),
      (p2.x), (p2.y),
      (p3.x), (p3.y),
    );
    ctx.strokeStyle = "purple";
    ctx.stroke();
    
    
    ctx.fillStyle = "red";
    ctx.fillRect((p1.x - 4), (p1.y - 4), 8, 8); // handle point for a
    ctx.fillRect((p2.x - 4), (p2.y - 4), 8, 8); // handle point for b

    ctx.beginPath()
    ctx.strokeStyle = "#aaaaaa"; // Handle color

    // Handle for a
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p0.x, p0.y);

    // Handle for b
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.stroke();
  }
}

function addPoint(point) {
  if (typeof point !== "object")   { throw new Error("Expected 'point' to be an object."); }
  if (typeof point.x !== "number") { throw new Error("Expected 'x' to be a number."); }
  if (typeof point.y !== "number") { throw new Error("Expected 'y' to be a number."); }

  const id = Math.random().toString();

  points[id] = point;
  renderPoint(point);
  return id;
}

function deletePoint(id) {
  delete points[id];
}

function addConnection(p0Id, p1, p2, p3Id) {
  const id = toConnectionId(p0Id, p3Id);
  connections[id] = {
    id,
    points: [p0Id, p3Id],
    handles: [
      p1,
      p2,
    ],
  };
}

function deleteConnection(id) {
  delete connections[id];
}

function getConnectionPoints(c) {
  return [
    getPointById(c.points[0]),
    c.handles[0],
    c.handles[1],
    getPointById(c.points[1]),
  ];
}

function calcBezierPoint(c, t) {
  const [ p0, p1, p2, p3 ] = getConnectionPoints(c);
  const u = 1 - t;

  function calcPart(which) {
    let p =           Math.pow(u, 3) * p0[which]; // first term
        p += 3 * t *  Math.pow(u, 2) * p1[which]; // second term
        p += 3 * u *  Math.pow(t, 2) * p2[which]; // third term
        p +=          Math.pow(t, 3) * p3[which]; // fourth term
    return p;
  }

  const x = calcPart("x");
  const y = calcPart("y");

  return { x, y, t };
}

/**
 * For a nice geometric visualization of the math, check below.
 * http://www.iscriptdesign.com/?sketch=tutorial/splitbezier
 */
function splitBezier(points, t) {
  const [ p1 ,p2, p3, p4 ] = points;

  const x1 = p1.x;
  const y1 = p1.y;

  const x2 = p2.x;
  const y2 = p2.y;

  const x3 = p3.x;
  const y3 = p3.y;

  const x4 = p4.x;
  const y4 = p4.y;

  x12 =   (x2 - x1) * t + x1;
  y12 =   (y2 - y1) * t + y1;

  x23 =   (x3 - x2) * t + x2;
  y23 =   (y3 - y2) * t + y2;

  x34 =   (x4 - x3) * t + x3;
  y34 =   (y4 - y3) * t + y3;

  x123 =  (x23 - x12) * t + x12;
  y123 =  (y23 - y12) * t + y12;

  x234 =  (x34 - x23) * t + x23;
  y234 =  (y34 - y23) * t + y23;

  x1234 = (x234 - x123) * t + x123;
  y1234 = (y234 - y123) * t + y123;

  /**
   * Credit to https://stackoverflow.com/a/8405756.
   *
   * Below is absolutely gorgeous.
   */
  return [
    { x: x1,    y: y1     }, // The left hand point
    { x: x12,   y: y12    },
    { x: x123,  y: y123   },
    { x: x1234, y: y1234  }, // The new split point
    { x: x234,  y: y234   },
    { x: x34,   y: y34    },
    { x: x4,    y: y4     }, // The right hand point
  ];
}

/**
 * c is the connection.
 * n is the number of points.
 * tStart is the t value of the first point.
 * tEnd is the t value of the last point.
 */
function getPointsBetween(c, n, tStart, tEnd) {
  const points = [];

  for (let i = 0; i < n; i += 1) {
    const t = getIntermediateNumber(tStart, tEnd, (i / n));
    const point = calcBezierPoint(c, t);
    points.push(point);
  }

  return points;
}

const numApproxPoints = 30;

/**
 * Finds the closest point from a position to the bezier curve that
 * represents the connection.
 *
 * If the closest point is over 20px away null is returned.
 *
 * Else it returns an point.
 */
function getClosestPointOnConnection(c, position) {
  let closestApprox;
  let secondApprox;

  /**
   * Finding the initial approximation points
   */
  for (let i = 0; i < numApproxPoints; i += 1) {
    const t = i / (numApproxPoints - 1);
    const bezierPoint = calcBezierPoint(c, getIntermediateNumber(0, 1, t));

    const distance = calcDistanceBetweenPoints(position, bezierPoint);
    const point = {
      x: bezierPoint.x,
      y: bezierPoint.y,
      distance,
      t,
    };

    if (!closestApprox || (distance < closestApprox.distance)) {
      secondApprox = closestApprox;
      closestApprox = point;
    } else if (!secondApprox || (distance < secondApprox.distance)) {
      secondApprox = point;
    }
  }

  if (closestApprox.distance > 400) { // 20px
    return null;
  }

  const points = getPointsBetween(c, 20, closestApprox.t, secondApprox.t);
  let closestPoint;

  for (let i = 0; i < points.length; i += 1) {
    const distance = calcDistanceBetweenPoints(position, points[i]);
    if (!closestPoint || (distance < closestPoint.distance)) {
      closestPoint = {
        x: points[i].x,
        y: points[i].y,
        t: points[i].t,
        distance,
      };
    }
  }

  return closestPoint;
}

function getPointAtPosition(position) {
  const keys = Object.keys(points);
  for (let i = 0; i < keys.length; i += 1) {
    const distance = calcDistanceBetweenPoints(position, points[keys[i]]);
    if (distance < 400) { // 20px
      return {
        type: "__POINT",
        value: points[keys[i]],
      };
    }
  }
  return null;
}

function getConnectionAtPosition(position) {
  const keys = Object.keys(connections);
  for (let i = 0; i < keys.length; i += 1) {
    const closestPoint = getClosestPointOnConnection(connections[keys[i]], position)
    if (closestPoint) { // 20px
      return {
        type: "__CONNECTION",
        value: {
          closestPoint,
          connection: connections[keys[i]],
        },
      };
    }
  }
  return null;
}

function resolveObjectAtPosition(position) {
  /**
   * Returns a point on a path if it's close enough.
   */
  const point = getPointAtPosition(position);
  if (point) {
    return point;
  }

  /**
   * Returns the closest point on the connection if a connection
   * is returned.
   */
  const connection = getConnectionAtPosition(position);
  if (connection) {
    return connection;
  }

  return null;
}

function renderObjectInteraction({ type, value }) {
  if (type === "__POINT") {
    renderCircle(value, 16, "blue");
  }

  if (type === "__CONNECTION") {
    renderCircle(value.closestPoint, 4, "red")
  }
}

function render(position) {
  ctx.clearRect(0, 0, ctxWidth, ctxHeight);

  renderConnections();
  renderPoints();

  /**
   * See if the user is close enough to something that
   * he can interact with.
   */
  if (position) {
    const obj = resolveObjectAtPosition(position);
    if (obj) {
      renderObjectInteraction(obj); // Show that interaction
    }
  }
}

const toPosition = e => ({
  x: e.clientX - getLeftOffset(),
  y: e.clientY - getTopOffset(),
})

canvas.onmousemove = (e) => {
  // callMouseMoveExecutionQueue();
  render(toPosition(e));
}

function resolveMouseDown(e) {
  const position = {
    x: e.clientX - getLeftOffset(),
    y: e.clientY - getTopOffset(),
  };

  /**
   * See if the user is close enough to something that
   * he can interact with.
   */
  const obj = resolveObjectAtPosition(position);
  if (!obj) {
    return;
  }

  const { value, type } = obj;
  
  // If that point was close enough, we use said point
  if (type === "__CONNECTION") {
    const { connection, closestPoint } = value;

    const [ a, b ] = connection.points; // These are the point ids, not the actual points.
    const { t } = closestPoint; // t is where we split the path

    /**
     * p0 is a
     * p6 is b
     * p3 is the new point.
     *
     * The other points (p1, p2, p4, p5) are the handles.
     */
    const [ p0, p1, p2, p3, p4, p5, p6 ] = splitBezier(getConnectionPoints(connection), t);

    // We remove the old connection
    deleteConnection(connection.id);

    const newPointId = addPoint(p3);

    /**
     * Notice how we give the ids of the points for the first
     * and last parameter, not the actual points themselves.
     *
     * The order here matters.
     */
    addConnection(a, p1, p2, newPointId);
    addConnection(newPointId, p4, p5, b);
    
    ctx.clearRect(0, 0, ctxWidth, ctxHeight);
    renderConnections();
    renderPoints();
  }
}

mainContainer.onmousedown = resolveMouseDown;

render();
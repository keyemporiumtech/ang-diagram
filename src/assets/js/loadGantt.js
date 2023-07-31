// Custom Layout for myGantt Diagram
class GanttLayout extends go.Layout {
  constructor() {
    super();
    this.cellHeight = GridCellHeight;
  }

  doLayout(coll) {
    coll = this.collectParts(coll);
    const diagram = this.diagram;
    diagram.startTransaction("Gantt Layout");
    const bars = [];
    this.assignTimes(diagram, bars);
    this.arrangementOrigin = this.initialOrigin(this.arrangementOrigin);
    let y = this.arrangementOrigin.y;
    bars.forEach((node) => {
      const tasknode = myTasks.findNodeForData(node.data);
      node.visible = tasknode.isVisible();
      node.moveTo(convertStartToX(node.data.start), y);
      if (node.visible) y += this.cellHeight;
    });
    diagram.commitTransaction("Gantt Layout");
  }

  // Update node data, to make sure each node has a start and a duration
  assignTimes(diagram, bars) {
    const roots = diagram.findTreeRoots();
    roots.each((root) => this.walkTree(root, 0, bars));
  }

  walkTree(node, start, bars) {
    bars.push(node);
    const model = node.diagram.model;
    if (node.isTreeLeaf) {
      let dur = node.data.duration;
      if (dur === undefined || isNaN(dur)) {
        dur = convertDaysToUnits(1); // default task length?
        model.set(node.data, "duration", dur);
      }
      let st = node.data.start;
      if (st === undefined || isNaN(st)) {
        st = start; // use given START
        model.set(node.data, "start", st);
      }
      return st + dur;
    } else {
      // first recurse to fill in any missing data
      node.findTreeChildrenNodes().each((n) => {
        start = this.walkTree(n, start, bars);
      });
      // now can calculate this non-leaf node's data
      let min = Infinity;
      let max = -Infinity;
      const colors = new go.Set();
      node.findTreeChildrenNodes().each((n) => {
        min = Math.min(min, n.data.start);
        max = Math.max(max, n.data.start + n.data.duration);
        if (n.data.color) colors.add(n.data.color);
      });
      model.set(node.data, "start", min);
      model.set(node.data, "duration", max - min);
      return max;
    }
  }
}
// end of GanttLayout

var GridCellHeight = 20; // document units; cannot be changed dynamically
var GridCellWidth = 12; // document units per day; this can be modified -- see rescale()
var TimelineHeight = 24; // document units; cannot be changed dynamically

const MsPerDay = 24 * 60 * 60 * 1000;

// By default the values for the data properties start and duration are in days,
// and the start value is relative to the StartDate.
// If you want the start and duration properties to be in a unit other than days,
// you only need to change the implementation of convertDaysToUnits and convertUnitsToDays.

function convertDaysToUnits(n) {
  return n;
}

function convertUnitsToDays(n) {
  return n;
}

function convertStartToX(start) {
  return convertUnitsToDays(start) * GridCellWidth;
}

function convertXToStart(x, node) {
  return convertDaysToUnits(x / GridCellWidth);
}

// these four functions are used in TwoWay Bindings on the task/node template
function convertDurationToW(duration) {
  return convertUnitsToDays(duration) * GridCellWidth;
}

function convertWToDuration(w) {
  return convertDaysToUnits(w / GridCellWidth);
}

function convertStartToPosition(start, node) {
  return new go.Point(convertStartToX(start), node.position.y || 0);
}

function convertPositionToStart(pos) {
  return convertXToStart(pos.x);
}

var StartDate = new Date(); // set from Model.modelData.origin

function valueToText(n) {
  // N document units after StartDate
  const startDate = StartDate;
  const startDateMs =
    startDate.getTime() + startDate.getTimezoneOffset() * 60000;
  const date = new Date(startDateMs + (n / GridCellWidth) * MsPerDay);
  return date.toLocaleDateString();
}

function dateToValue(d) {
  // D is a Date
  const startDate = StartDate;
  const startDateMs =
    startDate.getTime() + startDate.getTimezoneOffset() * 60000;
  const dateInMs = d.getTime() + d.getTimezoneOffset() * 60000;
  const msSinceStart = dateInMs - startDateMs;
  return (msSinceStart / MsPerDay) * GridCellWidth;
}

// the custom figure used for task bars that have downward points at their ends
go.Shape.defineFigureGenerator("RangeBar", (shape, w, h) => {
  const b = Math.min(5, w);
  const d = Math.min(5, h);
  return new go.Geometry().add(
    new go.PathFigure(0, 0, true)
      .add(new go.PathSegment(go.PathSegment.Line, w, 0))
      .add(new go.PathSegment(go.PathSegment.Line, w, h))
      .add(new go.PathSegment(go.PathSegment.Line, w - b, h - d))
      .add(new go.PathSegment(go.PathSegment.Line, b, h - d))
      .add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  );
});

const $ = go.GraphObject.make;

function standardContextMenus() {
  return {
    contextMenu: $(
      "ContextMenu",
      $("ContextMenuButton", $(go.TextBlock, "Details..."), {
        click: (e, button) => {
          const task = button.part.adornedPart;
          console.log(
            "show HTML panel with details about the task " + task.text
          );
        },
      }),
      $("ContextMenuButton", $(go.TextBlock, "New Task"), {
        click: (e, button) => {
          const task = button.part.adornedPart;
          e.diagram.model.commit((m) => {
            const newdata = {
              key: undefined,
              text: "New Task",
              color: task.data.color,
              duration: convertDaysToUnits(5),
            };
            m.addNodeData(newdata);
            m.addLinkData({ from: task.key, to: newdata.key });
            e.diagram.select(e.diagram.findNodeForData(newdata));
          });
        },
      })
    ),
  };
}

// the tree on the left side of the page
const myTasks = new go.Diagram("myTasksDiv", {
  initialContentAlignment: go.Spot.Right,
  // make room on top for myTimeline and a bit of spacing; on bottom for whole task row and a bit more
  padding: new go.Margin(TimelineHeight + 4, 0, GridCellHeight, 0), // needs to be the same vertically as for myGantt
  hasVerticalScrollbar: false,
  allowMove: false,
  allowCopy: false,
  "commandHandler.deletesTree": true,
  layout: $(go.TreeLayout, {
    alignment: go.TreeLayout.AlignmentStart,
    compaction: go.TreeLayout.CompactionNone,
    layerSpacing: 16,
    layerSpacingParentOverlap: 1,
    nodeIndentPastParent: 1,
    nodeSpacing: 0,
    portSpot: go.Spot.Bottom,
    childPortSpot: go.Spot.Left,
    arrangementSpacing: new go.Size(0, 0),
    // after the tree layout, change the width of each node so that all
    // of the nodes have widths such that the collection has a given width
    commitNodes: function () {
      // method override must be function, not =>
      go.TreeLayout.prototype.commitNodes.call(this);
      updateNodeWidths(400);
    },
  }),
  mouseLeave: (e, node) => (myHighlightTask.visible = false),
  "animationManager.isInitial": false,
  TreeCollapsed: (e) => myGantt.layoutDiagram(true),
  TreeExpanded: (e) => myGantt.layoutDiagram(true),
  ChangedSelection: (e) => {
    // selecting a bar also selects the corresponding task in myTasks
    if (myChangingSelection) return;
    myChangingSelection = true;
    const tasks = [];
    e.diagram.selection.each((part) => {
      if (part instanceof go.Node)
        tasks.push(myGantt.findNodeForData(part.data));
    });
    myGantt.selectCollection(tasks);
    myChangingSelection = false;
  },
});

var myChangingSelection = false;

myTasks.nodeTemplate = $(
  go.Node,
  "Table",
  {
    columnSizing: go.RowColumnDefinition.None,
    selectionAdorned: false,
    height: GridCellHeight,
    mouseEnter: (e, node) => {
      node.background = "rgba(0,0,255,0.2)";
      myHighlightTask.position = new go.Point(
        myGrid.actualBounds.x,
        node.actualBounds.y
      );
      myHighlightTask.width = myGrid.actualBounds.width;
      myHighlightTask.visible = true;
    },
    mouseLeave: (e, node) => {
      node.background = node.isSelected ? "dodgerblue" : "transparent";
      myHighlightTask.visible = false;
    },
    doubleClick: (e, node) => {
      // scroll myGantt so the corresponding bar is visible
      const bar = myGantt.findNodeForData(node.data);
      if (bar) myGantt.commandHandler.scrollToPart(bar);
    },
  },
  new go.Binding("background", "isSelected", (s) =>
    s ? "dodgerblue" : "transparent"
  ).ofObject(),
  new go.Binding("isTreeExpanded").makeTwoWay(),
  $(go.RowColumnDefinition, { column: 0, width: 14 }),
  $("TreeExpanderButton", { column: 0, portId: "", scale: 0.85 }),
  $(go.RowColumnDefinition, { column: 1, alignment: go.Spot.Left }),
  $(
    go.TextBlock,
    { column: 1, editable: true },
    new go.Binding("text").makeTwoWay()
  ),
  // additional columns
  $(go.RowColumnDefinition, {
    column: 2,
    width: 40,
    alignment: go.Spot.Right,
    separatorPadding: new go.Margin(0, 4),
    separatorStroke: "gray",
  }),
  $(
    go.TextBlock,
    { column: 2 },
    new go.Binding("text", "start", (s) => s.toFixed(2))
  ),
  $(go.RowColumnDefinition, {
    column: 3,
    width: 40,
    alignment: go.Spot.Right,
    separatorPadding: new go.Margin(0, 4),
    separatorStroke: "gray",
  }),
  $(
    go.TextBlock,
    { column: 3 },
    new go.Binding("text", "duration", (d) => d.toFixed(2))
  ),

  standardContextMenus()
);

var TREEWIDTH = 160; // document units, may be modified, used by updateNodeWidths

function updateNodeWidths(width) {
  let minx = Infinity;
  myTasks.nodes.each((n) => {
    if (n instanceof go.Node) {
      minx = Math.min(minx, n.actualBounds.x);
    }
  });
  if (minx === Infinity) return;
  const right = minx + width;
  myTasks.nodes.each((n) => {
    if (n instanceof go.Node) {
      n.width = Math.max(0, right - n.actualBounds.x);
      n.getColumnDefinition(1).width = TREEWIDTH - n.actualBounds.x;
    }
  });
  myTasksHeader.getColumnDefinition(1).width =
    TREEWIDTH - myTasksHeader.actualBounds.x;
}

const myTasksHeader = // the timeline at the top of the myTasks viewport
  $(
    go.Part,
    "Table",
    {
      layerName: "Adornment",
      pickable: false,
      position: new go.Point(-26, 0), // position will be set in "ViewportBoundsChanged" listener
      columnSizing: go.RowColumnDefinition.None,
      selectionAdorned: false,
      height: GridCellHeight,
      background: "lightgray",
    },
    $(go.RowColumnDefinition, { column: 0, width: 14 }),
    $(go.RowColumnDefinition, { column: 1 }),
    $(go.TextBlock, "Name", { column: 1 }),
    // additional columns
    $(go.RowColumnDefinition, {
      column: 2,
      width: 40,
      alignment: go.Spot.Right,
      separatorPadding: new go.Margin(0, 4),
      separatorStroke: "gray",
    }),
    $(go.TextBlock, "Start", { column: 2 }),
    $(go.RowColumnDefinition, {
      column: 3,
      width: 40,
      alignment: go.Spot.Right,
      separatorPadding: new go.Margin(0, 4),
      separatorStroke: "gray",
    }),
    $(go.TextBlock, "Dur.", { column: 3 })
  );
myTasks.add(myTasksHeader);

myTasks.linkTemplate = $(
  go.Link,
  {
    selectable: false,
    routing: go.Link.Orthogonal,
    fromEndSegmentLength: 1,
    toEndSegmentLength: 1,
  },
  $(go.Shape)
);

myTasks.linkTemplateMap.add(
  "Dep",
  $(
    go.Link, // ignore these links in the Tasks diagram
    { selectable: false, visible: false, isTreeLink: false }
  )
);

// the right side of the page, holding both the timeline and all of the task bars
myGantt = new go.Diagram("myGanttDiv", {
  initialPosition: new go.Point(-10, -100), // show labels
  // make room on top for myTimeline and a bit of spacing; on bottom for whole task row and a bit more
  padding: new go.Margin(
    TimelineHeight + 4,
    GridCellWidth * 7,
    GridCellHeight,
    0
  ), // needs to be the same vertically as for myTasks
  scrollMargin: new go.Margin(0, GridCellWidth * 7, 0, 0), // and allow scrolling to a week beyond that
  allowCopy: false,
  "commandHandler.deletesTree": true,
  "draggingTool.isGridSnapEnabled": true,
  "draggingTool.gridSnapCellSize": new go.Size(GridCellWidth, GridCellHeight),
  "draggingTool.dragsTree": true,
  "resizingTool.isGridSnapEnabled": true,
  "resizingTool.cellSize": new go.Size(GridCellWidth, GridCellHeight),
  "resizingTool.minSize": new go.Size(GridCellWidth, GridCellHeight),
  layout: $(GanttLayout),
  mouseOver: (e) => {
    if (!myGrid || !myHighlightDay) return;
    const lp = myGrid.getLocalPoint(e.documentPoint);
    const day = Math.floor(convertXToStart(lp.x)); // floor gets start of day
    myHighlightDay.position = new go.Point(
      convertStartToX(day),
      myGrid.position.y
    );
    myHighlightDay.width = GridCellWidth; // 1 day
    myHighlightDay.height = myGrid.actualBounds.height;
    myHighlightDay.visible = true;
  },
  mouseLeave: (e) => (myHighlightDay.visible = false),
  "animationManager.isInitial": false,
  SelectionMoved: (e) => e.diagram.layoutDiagram(true),
  DocumentBoundsChanged: (e) => {
    // the grid extends to only the area needed
    const b = e.diagram.documentBounds;
    myGrid.desiredSize = new go.Size(b.width + GridCellWidth * 7, b.bottom);
    // the timeline, which is not in the documentBounds, only covers the needed area
    // widen to cover whole weeks
    myTimeline.graduatedMax =
      Math.ceil(b.width / (GridCellWidth * 7)) * (GridCellWidth * 7);
    myTimeline.findObject("MAIN").width = myTimeline.graduatedMax;
    myTimeline.findObject("TICKS").height = Math.max(
      e.diagram.documentBounds.height,
      e.diagram.viewportBounds.height
    );
  },
  ChangedSelection: (e) => {
    // selecting a task also selects the corresponding bar in myGantt
    if (myChangingSelection) return;
    myChangingSelection = true;
    const bars = [];
    e.diagram.selection.each((part) => {
      if (part instanceof go.Node)
        bars.push(myTasks.findNodeForData(part.data));
    });
    myTasks.selectCollection(bars);
    myChangingSelection = false;
  },
});

const myTimeline = // the timeline at the top of the myGantt viewport
  $(
    go.Part,
    "Graduated",
    {
      layerName: "Adornment",
      pickable: false,
      position: new go.Point(-26, 0), // position will be set in "ViewportBoundsChanged" listener
      graduatedTickUnit: GridCellWidth, // each tick is one day
      // assume graduatedMax == length of line
    },
    $(go.Shape, "LineH", {
      name: "MAIN",
      strokeWidth: 0, // don't draw the actual line
      height: TimelineHeight, // width will be set in "DocumentBoundsChanged" listener
      background: "lightgray",
    }),
    $(go.Shape, "LineV", {
      name: "TICKS",
      interval: 7, // once per week
      alignmentFocus: new go.Spot(0.5, 0, 0, -TimelineHeight / 2), // tick marks cross over the timeline itself
      stroke: "lightgray",
      strokeWidth: 0.5,
    }),
    $(go.TextBlock, {
      alignmentFocus: go.Spot.Left,
      interval: 7, // once per week
      graduatedFunction: valueToText,
      graduatedSkip: (val, tb) =>
        val > tb.panel.graduatedMax - GridCellWidth * 7, // don't show last label
    })
  );
myGantt.add(myTimeline);

const myGrid = // the grid of horizontal lines
  $(
    go.Part,
    "Grid",
    {
      layerName: "Grid",
      pickable: false,
      position: new go.Point(0, 0),
      gridCellSize: new go.Size(3000, GridCellHeight),
    },
    $(go.Shape, "LineH", { strokeWidth: 0.5 })
  );
myGantt.add(myGrid);

const myHighlightDay = // the vertical highlighter covering the day where the mouse is
  $(go.Part, {
    layerName: "Grid",
    visible: false,
    pickable: false,
    background: "rgba(255,0,0,0.2)",
    position: new go.Point(0, 0),
    width: GridCellWidth,
    height: GridCellHeight,
  });
myGantt.add(myHighlightDay);

const myHighlightTask = // the horizontal highlighter covering the current task
  $(go.Part, {
    layerName: "Grid",
    visible: false,
    pickable: false,
    background: "rgba(0,0,255,0.2)",
    position: new go.Point(0, 0),
    width: GridCellWidth,
    height: GridCellHeight,
  });
myGantt.add(myHighlightTask);

myGantt.nodeTemplate = $(
  go.Node,
  "Spot",
  {
    selectionAdorned: false,
    selectionChanged: (node) => {
      node.diagram.commit((diag) => {
        node.findObject("SHAPE").fill = node.isSelected
          ? "dodgerblue"
          : (node.data && node.data.color) || "gray";
      }, null);
    },
    minLocation: new go.Point(0, NaN),
    maxLocation: new go.Point(Infinity, NaN),
    toolTip: $(
      "ToolTip",
      $(
        go.Panel,
        "Table",
        { defaultAlignment: go.Spot.Left },
        $(go.RowColumnDefinition, { column: 1, separatorPadding: 3 }),
        $(
          go.TextBlock,
          { row: 0, column: 0, columnSpan: 9, font: "bold 12pt sans-serif" },
          new go.Binding("text")
        ),
        $(go.TextBlock, { row: 1, column: 0 }, "start:"),
        $(
          go.TextBlock,
          { row: 1, column: 1 },
          new go.Binding(
            "text",
            "start",
            (d) => "day " + convertUnitsToDays(d).toFixed(0)
          )
        ),
        $(go.TextBlock, { row: 2, column: 0 }, "length:"),
        $(
          go.TextBlock,
          { row: 2, column: 1 },
          new go.Binding(
            "text",
            "duration",
            (d) => convertUnitsToDays(d).toFixed(0) + " days"
          )
        )
      )
    ),
    resizable: true,
    resizeObjectName: "SHAPE",
    resizeAdornmentTemplate: $(
      go.Adornment,
      "Spot",
      $(go.Placeholder),
      $(go.Shape, "Diamond", {
        alignment: go.Spot.Right,
        width: 8,
        height: 8,
        strokeWidth: 0,
        fill: "fuchsia",
        cursor: "e-resize",
      })
    ),
    mouseOver: (e, node) => myGantt.mouseOver(e),
  },
  standardContextMenus(),
  new go.Binding("position", "start", convertStartToPosition).makeTwoWay(
    convertPositionToStart
  ),
  new go.Binding("resizable", "isTreeLeaf").ofObject(),
  new go.Binding("isTreeExpanded").makeTwoWay(),
  $(
    go.Shape,
    {
      name: "SHAPE",
      height: 18,
      margin: new go.Margin(1, 0),
      strokeWidth: 0,
      fill: "gray",
    },
    new go.Binding("fill", "color"),
    new go.Binding("width", "duration", convertDurationToW).makeTwoWay(
      convertWToDuration
    ),
    new go.Binding("figure", "isTreeLeaf", (leaf) =>
      leaf ? "Rectangle" : "RangeBar"
    ).ofObject()
  ),
  // "RangeBar" is defined above as a custom figure
  $(
    go.TextBlock,
    {
      font: "8pt sans-serif",
      alignment: go.Spot.TopLeft,
      alignmentFocus: new go.Spot(0, 0, 0, -2),
    },
    new go.Binding("text"),
    new go.Binding("stroke", "color", (c) =>
      go.Brush.isDark(c) ? "#DDDDDD" : "#333333"
    )
  )
);

myGantt.linkTemplate = $(go.Link, { visible: false });

myGantt.linkTemplateMap.add(
  "Dep",
  $(
    go.Link,
    {
      routing: go.Link.Orthogonal,
      isTreeLink: false,
      isLayoutPositioned: false,
      fromSpot: new go.Spot(0.999999, 1),
      toSpot: new go.Spot(0.000001, 0),
    },
    $(go.Shape, { stroke: "brown", strokeWidth: 3 }),
    $(go.Shape, {
      toArrow: "Standard",
      fill: "brown",
      strokeWidth: 0,
      scale: 0.75,
    })
  )
);

// The Model that is shared by both Diagrams
const myModel = new go.GraphLinksModel({
  modelData: {
    origin: 1531540800000, // new Date(2018, 6, 14);
  },
  nodeDataArray: [
    { key: 0, text: "Project X" },
    { key: 1, text: "Task 1", color: "darkgreen" },
    {
      key: 11,
      text: "Task 1.1",
      color: "green",
      duration: convertDaysToUnits(7),
    },
    { key: 12, text: "Task 1.2", color: "green" },
    {
      key: 121,
      text: "Task 1.2.1",
      color: "lightgreen",
      duration: convertDaysToUnits(3),
    },
    {
      key: 122,
      text: "Task 1.2.2",
      color: "lightgreen",
      duration: convertDaysToUnits(5),
    },
    {
      key: 123,
      text: "Task 1.2.3",
      color: "lightgreen",
      duration: convertDaysToUnits(4),
    },
    { key: 2, text: "Task 2", color: "darkblue" },
    {
      key: 21,
      text: "Task 2.1",
      color: "blue",
      duration: convertDaysToUnits(15),
      start: convertDaysToUnits(10),
    },
    { key: 22, text: "Task 2.2", color: "goldenrod" },
    {
      key: 221,
      text: "Task 2.2.1",
      color: "yellow",
      duration: convertDaysToUnits(8),
    },
    {
      key: 222,
      text: "Task 2.2.2",
      color: "yellow",
      duration: convertDaysToUnits(6),
    },
    { key: 23, text: "Task 2.3", color: "darkorange" },
    {
      key: 231,
      text: "Task 2.3.1",
      color: "orange",
      duration: convertDaysToUnits(11),
    },
    { key: 3, text: "Task 3", color: "maroon" },
    {
      key: 31,
      text: "Task 3.1",
      color: "brown",
      duration: convertDaysToUnits(10),
    },
    { key: 32, text: "Task 3.2", color: "brown" },
    {
      key: 321,
      text: "Task 3.2.1",
      color: "lightsalmon",
      duration: convertDaysToUnits(8),
    },
    {
      key: 322,
      text: "Task 3.2.2",
      color: "lightsalmon",
      duration: convertDaysToUnits(3),
    },
    {
      key: 323,
      text: "Task 3.2.3",
      color: "lightsalmon",
      duration: convertDaysToUnits(7),
    },
    {
      key: 324,
      text: "Task 3.2.4",
      color: "lightsalmon",
      duration: convertDaysToUnits(5),
      start: convertDaysToUnits(71),
    },
    {
      key: 325,
      text: "Task 3.2.5",
      color: "lightsalmon",
      duration: convertDaysToUnits(4),
    },
    {
      key: 326,
      text: "Task 3.2.6",
      color: "lightsalmon",
      duration: convertDaysToUnits(5),
    },
  ],
  linkDataArray: [
    { from: 0, to: 1 },
    { from: 1, to: 11 },
    { from: 1, to: 12 },
    { from: 12, to: 121 },
    { from: 12, to: 122 },
    { from: 12, to: 123 },
    { from: 0, to: 2 },
    { from: 2, to: 21 },
    { from: 2, to: 22 },
    { from: 22, to: 221 },
    { from: 22, to: 222 },
    { from: 2, to: 23 },
    { from: 23, to: 231 },
    { from: 0, to: 3 },
    { from: 3, to: 31 },
    { from: 3, to: 32 },
    { from: 32, to: 321 },
    { from: 32, to: 322 },
    { from: 32, to: 323 },
    { from: 32, to: 324 },
    { from: 32, to: 325 },
    { from: 32, to: 326 },
    { from: 11, to: 2, category: "Dep" },
  ],
});
StartDate = new Date(myModel.modelData.origin);

// share model
myTasks.model = myModel;
myGantt.model = myModel;
myModel.undoManager.isEnabled = true;

// sync viewports
var changingView = false; // for preventing recursive updates
myTasks.addDiagramListener("ViewportBoundsChanged", (e) => {
  if (changingView) return;
  changingView = true;
  myTasksHeader.position = new go.Point(
    myTasksHeader.position.x,
    myTasks.viewportBounds.position.y
  );
  myGantt.scale = myTasks.scale;
  myGantt.position = new go.Point(myGantt.position.x, myTasks.position.y);
  myTimeline.position = new go.Point(
    myTimeline.position.x,
    myGantt.viewportBounds.position.y
  );
  changingView = false;
});
myGantt.addDiagramListener("ViewportBoundsChanged", (e) => {
  if (changingView) return;
  changingView = true;
  myTasks.scale = myGantt.scale;
  myTasks.position = new go.Point(myTasks.position.x, myGantt.position.y);
  myTasksHeader.position = new go.Point(
    myTasksHeader.position.x,
    myTasks.viewportBounds.position.y
  );
  myGantt.position = new go.Point(myGantt.position.x, myTasks.position.y); // don't scroll more if myTasks can't scroll more
  myTimeline.position = new go.Point(
    myTimeline.position.x,
    myGantt.viewportBounds.position.y
  );
  changingView = false;
});

// change horizontal scale
function rescale() {
  const val = parseFloat(document.getElementById("widthSlider").value);
  myGantt.commit((diag) => {
    GridCellWidth = val;
    diag.scrollMargin = new go.Margin(0, GridCellWidth * 7, 0, 0);
    diag.toolManager.draggingTool.gridSnapCellSize = new go.Size(
      GridCellWidth,
      GridCellHeight
    );
    diag.toolManager.resizingTool.cellSize = new go.Size(
      GridCellWidth,
      GridCellHeight
    );
    diag.toolManager.resizingTool.minSize = new go.Size(
      GridCellWidth,
      GridCellHeight
    );
    diag.updateAllTargetBindings();
    diag.layout.cellHeight = GridCellHeight;
    diag.layoutDiagram(true);
    myTimeline.graduatedTickUnit = GridCellWidth;
    diag.padding = new go.Margin(
      TimelineHeight + 4,
      GridCellWidth * 7,
      GridCellHeight,
      0
    );
    myTasks.padding = new go.Margin(TimelineHeight + 4, 0, GridCellHeight, 0);
  }, null); // skipsUndoManager
}

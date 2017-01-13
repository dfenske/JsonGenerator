//tree.js

function NodeObj(id, title, tooltip, nodes) {
    this.id = id;
    this.title = title;
    this.tooltip = tooltip;
    //TODO add property that signifies type of component
    if (nodes == null) {
        this.nodes = [];
    } else {
        this.nodes = nodes;
    }
}
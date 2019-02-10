(function (d3version3) {
    d3version3.layout.treelist = function () {
        "use strict";
        var hierarchy = d3version3.layout.hierarchy().sort(null).value(null),
            nodeHeight = 0,
            childIndent = 0,
            size;

        var treelist = function (d, i) {
            var nodes = hierarchy.call(this, d, i),
                root = nodes[0];

            function visit(f, t, index, parent) {
                if (t) {
                    f(t, index, parent);
                }
                var children = t.children;
                if (children && children.length) {
                    children.forEach(function (child, ci) {
                        visit(f, child, ci, t);
                    });
                }
            }

            /**
             visit all nodes in the tree and set the x, y positions
             */
            function layout(node) {
                //all children of the same parent are rendered on the same  x level
                //y increases every time a child is added to the list
                var x = 0, y = 10;
                visit(function (n, index, parent) {
                    x = parent ? parent.x + childIndent : 0;
                    y = y + nodeHeight;
                    n.y = y;
                    n.x = x;

                }, node);
                //update size after visiting
                size = [x, y];
            }

            layout(root);
            return nodes;
        };

        treelist.size = function () {
            return size;
        };

        treelist.nodeHeight = function (d) {
            if (arguments.length) {
                nodeHeight = d;
                return treelist;
            }
            return nodeHeight;
        };

        treelist.childIndent = function (d) {
            if (arguments.length) {
                childIndent = d;
                return treelist;
            }
            return childIndent;
        };

        treelist.nodes = treelist;

        return treelist;
    };

}(d3version3));
var global = this;

var moduleRoot;
var TagTreeView;
var treeBox = {
    rowCountChanged: function () {},
    invalidateRow: function () {}
};

function warmUp() {
    moduleRoot = Components.utils.import("resource://hatenabookmark/modules/base.jsm", {});
    moduleRoot.require("ModelTemp");
    TagTreeView = moduleRoot.require("Widget.TagTreeView");
}

function setUp() {
    var helper = { utils: utils };
    utils.include('btil.js', helper);
    helper.load(global);

    var Tag = model("Tag");
    [
        [1, "Perl"], [1, "Ruby"], [1, "JavaScript"],
        [2, "Perl"], [2, "Ruby"],
        [3, "Ruby"], [3, "JavaScript"],
    ].forEach(function ([bmId, name]) {
        var tag = new Tag();
        tag.bookmark_id = bmId;
        tag.name = name;
        tag.save();
    });

    moduleRoot.hBookmark.Model.db = hBookmark.Model.db;
}

function testTagTreeView() {
    var view = new TagTreeView();
    view.setTree(treeBox);

    assert.equals(view.rowCount, 3);
    var cellTexts = [0, 1, 2].map(function (i) view.getCellText(i, {}));
    assert.equals(cellTexts.concat().sort(), ["JavaScript", "Perl", "Ruby"]);
    assert.equals(cellTexts[1], "Perl");

    view._openRelatedTags(view._visibleItems[1]);
    assert.equals(view.rowCount, 5);
}

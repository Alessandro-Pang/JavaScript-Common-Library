function export_raw(name, data) {
    var urlObject = window.URL || window.webkitURL || window;
    var export_blob = new Blob([data]);
    var save_link = document.createElement("a")
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    save_link.click()
}
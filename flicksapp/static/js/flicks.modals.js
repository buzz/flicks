(function() {

  var F = $.flicks;

  F.modals = {};

  F.modals.show_modal = function(title, cls, msg) {
    F.el.modal.find(".content").html(msg);
    F.el.modal.attr("class", "").addClass(cls);
    F.el.modal.dialog("option", "title", title)
      .dialog("open");
  };

  F.modals.error = function(msg) {
    F.modals.show_modal("Error", "error", msg);
  };

  F.modals.warning = function(msg) {
    F.modals.show_modal("Warning", "warning", msg);
  };

  F.modals.info = function(msg) {
    F.modals.show_modal("Info", "info", msg);
  };

  F.modals.init = function() {
    // initialize modal
    F.el.modal.dialog({
      autoOpen: false,
      modal: true,
      buttons: {
        Ok: function() {
          $(this).dialog("close");
        },
      },
    });
  };

})();

define([
  'views/modal'
], function(
  ModalView
) {

  var CoverView = ModalView.extend({

    template: 'modal-cover',
    behaviors: { BrokenImageReplace: {} }

  });

  return CoverView;

});

$(function() {

  var F = $.flicks;

  F.autocomplete =  {};

  // setups autocomplete for a specific element
  // 'field' is the model field to search
  // '$el' is the input that should be auto-completed
  F.autocomplete._setup = function(field, $el) {
    $el.autocomplete({
      source: function(request, response) {
        var q = request.term;
        // try cache first
        if (!(field in F.autocomplete))
          F.autocomplete[field] = {};
        if (q in F.autocomplete[field]) {
          response(F.autocomplete[field][q]);
          return;
        }
        $.ajax({
          url: "/autocomplete/",
          dataType: "json",
          type: "POST",
          data: {
            q: q,
            what: field,
          },
          success: function(data, status, xhr) {
            F.autocomplete[field][q] = data;
            response(data);
          },
          error: function(r) {
            F.modals.error(
              "<strong>Auto-complete failed!</strong><br><br>Error text: "
                + r.statusText);
          },
        });
      }
    });
  };

  F.autocomplete.setupTopSearch = function() {
    F.autocomplete._setup('title', $("#top-search input[name=query]"));
  };

  F.autocomplete.setupAdvancedSearch = function() {
    var inputs = {
      title:  $("#adv-search #as_title"),
      country: $("#adv-search #as_countries"),
      genre: $("#adv-search #as_genres"),
      keyword: $("#adv-search #as_keywords"),
      cast: $("#adv-search #as_cast"),
      director: $("#adv-search #as_directors"),
      writer: $("#adv-search #as_writers")
    };
    $.each(inputs, function(k, v) {
      F.autocomplete._setup(k, v);
    });
  };

});

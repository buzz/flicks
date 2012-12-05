$(function() {

  var F = $.flicks;

  var STR_TO_ISO = {
    "USA":              "us",
    "West Germany":     "de",
    "East Germany":     "de",
    "Germany":          "de",
    "German":           "de",
    "UK":               "gb",
    "English":          "gb",
    "New Zealand":      "nz",
    "France":           "fr",
    "French":           "fr",
    "Spain":            "es",
    "Spanish":          "es",
    "Italy":            "it",
    "Italian":          "it",
    "Russia":           "ru",
    "Russian":          "ru",
    "China":            "cn",
    "Cantonese":        "cn",
    "Mandarin":         "cn",
    "Chinese":          "cn",
    "Japan":            "jp",
    "Japanese":         "jp",
    "Greece":           "gr",
    "Greek":            "gr",
    "Tok Pisin":        "pg",
    "Ireland":          "ie",
    "Irish":            "ie",
    "Korea":            "kr",
    "Korean":           "kr",
    "Arabic":           "sa",
    "Australia":        "au",
    "Canada":           "ca",
    "Latin":            "va",
    "Czech Republic":   "cz",
    "Czech":            "cz",
    "Afrikaans":        "za",
    "South Africa":     "za",
    "Vietnam":          "vn",
    "Vietnamese":       "vn",
    "Portuguese":       "pt",
    "Portugal":         "pt",
    "Thai":             "th",
    "Thailand":         "th",
    "Israel":           "il",
    "Hebrew":           "il",
    "Iceland":          "is",
    "Icelandic":        "is",
    "Denmark":          "dk",
    "Danish":           "dk",
    "Norway":           "no",
    "Norwegian":        "no",
    "Hong Kong":        "hk",
    "Somalia":          "so",
    "Somali":           "so",
    "Netherlands":      "nl",
    "Dutch":            "nl",
    "Hungary":          "hu",
    "Hungarian":        "hu",
    "Sweden":           "se",
    "Swedish":          "se",
    "Persian":          "ir",
    "Iran":             "ir",
    "Brazil":           "bl",
    "Finland":          "fi",
    "Finnish":          "fi",

  };
  var STR_TO_ISO_KEYS = [];
  $.each(STR_TO_ISO, function(k, v) {
    STR_TO_ISO_KEYS.push(k);
  });
  F.str2iso = function(str) {
    if ($.inArray(str, STR_TO_ISO_KEYS) === -1) {
      console.info("Missing country/language key: '" + str + "'");
      return 'missing';
    } else {
      return STR_TO_ISO[str];
    }
  }

});

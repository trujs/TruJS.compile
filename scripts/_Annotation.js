/**
* This factory generates an Annotation worker object that could be used to add
*  read, or remove annotations in a string
*
* Annotations are denoted using the following syntax
*   /**[@name({ "var": "value" })]*\/
*
* @factory
* @function
*/
function _Annotation(regExGetMatches, regExForEachMatch) {
  var LINE_SPLIT = /\r?\n/g
  , ANNOTATION_PATT = /^\s*[\/][*][*]\s*\[@([^\(]+)(?:\((.*)\))?\]\s*[*][\/](?:\r?\n)?/gm
  , TRIM_PATT = /^[\n\r ]*(.*?)[\n\r ]*$/m;

  /**
  * Adds an annotation to the text
  * @function
  * @param {string} name The name of the annotation
  * @param {object} params The values of the annotation
  * @param {string} text The text to add the annotation to
  * @param {number} [line] The line number to insert the annotation before.
  */
  function annotate(name, params, text, line) {
    //create the annotation text
    var annotation = "/**[@" + name + "(" + JSON.stringify(params) + ")]*/"
    , nl = text.indexOf("\r") === -1 && "\n" || "\r\n";

    if (isNill(line)) {
      line = 0;
    }

    var lines = text.split(LINE_SPLIT);

    if (line > lines.length) {
      line = lines.length;
    }

    lines.splice(line, 0, annotation);

    return lines.join(nl);
  }
  /**
  * Adds all properties in `annotations` as annotations in the text
  * @function
  * @param {object} annotations The collection of annotations
  * @param {string} text The text to add the annotation to
  * @param {number} [line] The line number to insert the annotation before.
  */
  function annotateAll(annotations, text) {
    //loop through the annotations properties
    Object.keys(annotations).forEach(function forEachAn(anKey) {
      if (!isArray(annotations[anKey])) {
        annotations[anKey] = [annotations[anKey]];
      }
      //loop through each member of the annotation array
      annotations[anKey].forEach(function forEachAnnotation(annotation) {
        text = annotate(anKey, annotation, text, annotation.$line);
      });
    });
    return text;
  }
  /**
  * Looks for the first appearance of the `name` annotation and returns it. If
  * not found, returns undefined
  * @function
  */
  function lookup(name, text) {
    var ann = get(text);
    if (ann.hasOwnProperty(name)) {
      return ann[name];
    }
  }
  /**
  * Reads an returns all annotations with `name`
  * @function
  */
  function find(name, text) {
    var ans = getAll(text);
    return ans[name];
  }
  /**
  * Reads and returns all annotations in the text. Returning an object with
  * properties that match the annotation name, each of which is an array of
  * objects representing the annotation parameters
  * @function
  */
  function getAll(text) {
    var annotations = {};

    regExGetMatches(ANNOTATION_PATT, text).forEach(function forEachMatch(match) {

      //grp1 should be the name
      var name = match[1]
      //the second grp is the values
      , params = !!match[2] && match[2].split(",") || []
      , data = JSON.parse(params);

      data.$index = match.index;
      data.$line = getLineNumber(data, match.index);

      if (!annotations[name]) {
        annotations[name] = [];
      }

      annotations[name].push(data);
    });

    return annotations;
  }
  /**
  * Gets the first annotation for each name
  * @function
  */
  function get(text) {
    var ans = getAll(text), found = {};

    Object.keys(ans).forEach(function forEachKey(an) {
      found[an] = ans[an][0];
    });

    return found;
  }
  /**
  * Removes all annotations in the text referenced by `name`
  * @function
  */
  function remove(name, text) {
    return text.replace(ANNOTATION_PATT, function replaceAnnotation(val, valName) {
      if (valName === name) {
        return "";
      }
      return val;
    });
  }
  /**
  * Removes all annotations
  * @function
  */
  function clear(text) {
    return !!text && text.replace(ANNOTATION_PATT, "") || "";
  }
  /**
  * Extracts the text between annotations of `name`
  * @function
  */
  function extract(name, text) {
    //get the array of annotations with `name`
    var ans = find(name, text);
    //if we have annotations with `name`
    if (!!ans) {
      return ans.map(function ansMap(an, indx) {
        var index = an.$index //the index of the annotation
        , next = ans[indx + 1] //thenext item in the annotation array
        , nextIndex = !!next && next.$index || text.length + 1 //next an or end
        , data = text.substring(index, nextIndex - 1)
        ;

        //trim the leading and trailing lines and white space
        data = data.replace(TRIM_PATT, "$1");

        return data;
      });
    }
    //no annotations found with `name`
    return [];
  }
  /**
  * Finds the line number that the index value is in
  * @function
  */
  function getLineNumber(text, index) {
    var line = 0;

    regExForEachMatch(LINE_SPLIT, text, function (match) {
      if (match.index <= index) {
        line++;
      }
    });

    return line;
  }

  /**
  * @worker
  */
  return Object.create(Object, {
    "annotate": {
      "enumerable": true
      , "value": annotate
    }
    , "annotateAll": {
      "enumerable": true
      , "value": annotateAll
    }
    , "get": {
      "enumerable": true
      , "value": get
    }
    , "getAll": {
      "enumerable": true
      , "value": getAll
    }
    , "lookup": {
      "enumerable": true
      , "value": lookup
    }
    , "find": {
      "enumerable": true
      , "value": find
    }
    , "extract": {
      "enumerable": true
      , "value": extract
    }
    , "remove": {
      "enumerable": true
      , "value": remove
    }
    , "clear": {
      "enumerable": true
      , "value": clear
    }
  });
}

/**
* This factory produces a worker function that takes a `type` and string `data`
* and converts it into a string that is JavaScript variable compatible (escaped)
* @factory
*/
function _JavaScriptConverter() {
  var cnsts = {
      "image":["png","jpg","gif","jpeg","bmp"]
  };

  /**
  * Modifies the file contents for non javascript files, wrapping the text in
  *   quotes.
  * @function
  */
  function convertNonJs(data) {
    data = data.replace(/\r/g, "\\r");
    data = data.replace(/\n/g, "\\n");
    data = data.replace( /\u0022/g, "\\\u0022"); //double quotes need escaping
    data = "\"" + data + "\"";

    return data;
  }
  /**
  * Base 64 converts the data
  * @function
  */
  function convertImage(type, data) {
    return "\"data:image/" + type + ";base64," + (new Buffer(data).toString('base64')) + "\"";
  }

  /**
  * @worker
  * @param {string} type The type of data, html, xml, etc...
  * @param {string} data The data that needs converting
  */
  return function JavaScriptConverter(type, data) {
    //if the type is an image type
    if (cnsts.image.indexOf(type) !== -1) {
        return convertImage(data);
    }
    else {
        return convertNonJs(data);
    }
  };
}

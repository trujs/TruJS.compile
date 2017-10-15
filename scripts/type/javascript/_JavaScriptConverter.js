/**
* This factory produces a worker function that takes a `type` and string `data`
* and converts it into a string that is JavaScript variable compatible (escaped)
* @factory
*/
function _JavaScriptConverter() {

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
  * @worker
  * @param {string} type The type of data, html, xml, etc...
  * @param {string} data The data that needs converting
  */
  return function (type, data) {
    //currently all types can be converted with one method
    return convertNonJs(data);
  };
}

const filter = module.exports;

function isExpandable(obj) {
  if (
    (typeof obj.type === "function" && obj.type() === "object") ||
    (typeof obj.type === "function" && obj.type() === "array") ||
    (typeof obj.oneOf === "function" && obj.oneOf() && obj.oneOf().length) ||
    (typeof obj.anyOf === "function" && obj.anyOf() && obj.anyOf().length) ||
    (typeof obj.allOf === "function" && obj.allOf() && obj.allOf().length) ||
    (typeof obj.items === "function" && obj.items()) ||
    (typeof obj.additionalItems === "function" && obj.additionalItems()) ||
    (typeof obj.properties === "function" && obj.properties() && Object.keys(obj.properties()).length) ||
    (typeof obj.additionalProperties === "function" && obj.additionalProperties()) ||
    (typeof obj.extensions === "function" && obj.extensions() &&
      Object.keys(obj.extensions()).filter(e => !e.startsWith("x-parser-")).length) ||
    (typeof obj.patternProperties === "function" && obj.patternProperties())
  ) return true;

  return false;
}
filter.isExpandable = isExpandable;

function nonParserExtensions(schema) {
  if (!schema || !schema.extensions || typeof schema.extensions !== "function") return new Map();
  const extensions = Object.entries(schema.extensions());
  return new Map(extensions.filter(e => !e[0].startsWith("x-parser-")).filter(Boolean));
}
filter.nonParserExtensions = nonParserExtensions;

/**
 * Check if there is a channel which does not have one of the tags specified.
 */
function containTags(object, tagsToCheck) {
  if (!object) {
    throw new Error("object for containsTag was not provided?");
  }

  if (!tagsToCheck) {
    throw new Error("tagsToCheck for containsTag was not provided?");
  }

  //Ensure if only 1 tag are provided it is converted to array.
  if (tagsToCheck && !Array.isArray(tagsToCheck)) {
    tagsToCheck = [tagsToCheck];
  }
  //Check if pubsub contain one of the tags to check.
  let check = (tag) => {
    let found = false;
    for (let tagToCheckIndex in tagsToCheck) {
      let tagToCheck = tagsToCheck[tagToCheckIndex]._json;
      if (tagToCheck.name === tag.name) {
        found = true;
      }
    }
    return found;
  };

  //Ensure tags are checked for the group tags
  let containTags = object._json.tags ? object._json.tags.find(check) != null : false;
  return containTags;
};
filter.containTags = containTags;

/**
 * Check if there is a channel which does not have one of the tags specified.
 */
function containNoTag(channels, tagsToCheck) {
  if (!channels) {
    throw new Error("Channels for containNoTag was not provided?");
  }
  for (let channelIndex in channels) {
    let channel = channels[channelIndex]._json;
    //Check if the channel contains publish or subscribe which does not contain tags
    if (channel.publish && (!channel.publish.tags || channel.publish.tags.length == 0) ||
      channel.subscribe && (!channel.subscribe.tags || channel.subscribe.tags.length == 0)
    ) {
      //one does not contain tags
      return true;
    }

    //Check if channel publish or subscribe does not contain one of the tags to check.
    let check = (tag) => {
      let found = false;
      for (let tagToCheckIndex in tagsToCheck) {
        let tagToCheck = tagsToCheck[tagToCheckIndex]._json;
        if (tagToCheck.name === tag.name) {
          found = true;
        }
      }
      return found;
    };

    //Ensure pubsub tags are checked for the group tags
    let publishContainsNoTag = channel.publish && channel.publish.tags ? channel.publish.tags.find(check) == null : false;
    if (publishContainsNoTag === true) return true;
    let subscribeContainsNoTag = channel.subscribe && channel.subscribe.tags ? channel.subscribe.tags.find(check) == null : false;
    if (subscribeContainsNoTag === true) return true;
  }
  return false;
};
filter.containNoTag = containNoTag;

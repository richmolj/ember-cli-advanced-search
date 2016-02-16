import DS from 'ember-data';

export default DS.Transform.extend({

  _shouldSerialize(deserialized) {
    if (deserialized) {
      if (deserialized.values) {
        return deserialized.values.length > 0;
      } else {
        return true;
      }
    } else {
      return false;
    }
  },

  serialize(deserialized) {
    if (this._shouldSerialize(deserialized)) {
      let serializedValues = deserialized.values.map((v) => {
        let serializedValue = {
          id: v.id,
          key: v.key,
          text: v.text
        }

        if (v.user_query) {
          serializedValue.user_query = v.user_query
        }

        return serializedValue
      });
      return {
        and: deserialized.and || false,
        values: serializedValues
      };
    } else {
      return null;
    }
  },

  deserialize(value) {
    return value;
  }
});

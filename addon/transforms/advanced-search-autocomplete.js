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
        return {
          id: v.id,
          key: v.key,
          text: v.text
        };
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

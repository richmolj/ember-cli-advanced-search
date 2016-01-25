export default function(server) {
  server.create('person', {name: 'Marge'});
  server.create('person', {name: 'Bart'});
  server.create('person', {name: 'Homer'});
  server.create('person', {name: 'Lisa'});
}

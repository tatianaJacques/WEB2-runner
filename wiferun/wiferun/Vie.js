function Vie() {
  vie = 15;
}

Vie.prototype.ajouterVie = function() {
  return vie = vie + 1;
};

Vie.prototype.perdUneVie = function() {
  return vie = vie - 1;
};

Vie.prototype.getVie = function() {
  return vie;
};
Vie.prototype.resetVie = function() {
  return vie = 15;
};

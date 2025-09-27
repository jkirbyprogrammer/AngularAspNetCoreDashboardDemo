import * as L from 'leaflet';

// Extend L.Control to create a custom legend control
export class MapLegendControl extends L.Control {
  options = {
    position: 'bottomright' // Default position
  };

  onAdd(map: L.Map) {
    const div = L.DomUtil.create('div', 'info legend');
    // Example legend content:
    div.innerHTML = `
          <h4>Legend Title</h4>
          <i style="background: #ff0000"></i><span>Category 1</span><br>
          <i style="background: #00ff00"></i><span>Category 2</span><br>
          <i style="background: #0000ff"></i><span>Category 3</span>
        `;
    return div;
  }

  onRemove(map: L.Map) {
    // Nothing to do here for this simple example
  }
}

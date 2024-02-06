
export const displayMap = locations => {
  mapboxgl.accessToken = 'pk.eyJ1IjoicGFpbmUyNTQ3a3VuZyIsImEiOiJjbHJucXl4M3gwMWIzMmpueDMwNGhhczF2In0.PsuGkbEo9XJEkYtadQl99Q';
  const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v11',
    scrollZoom:true
    // center:[-118.113491,34.111745],
    // zoom:10,
    // interactive:false
  });

  const bounds = new mapboxgl.LngLatBounds()

  locations.forEach(loc => {
    // Add maker
    const el = document.createElement("div") 
    el.classList = 'marker'

    new mapboxgl.Marker({
      element:el,
      anchor:'bottom'
    })
    .setLngLat(loc.coordinates)
    .addTo(map)

    new mapboxgl.Popup({
      offset:30
    }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map)

    // Extend map bounds to includes current lacation
    bounds.extend(loc.coordinates)
  });


  map.fitBounds(bounds,{
    padding:{
      top:200,
      bottom:200,
      left:100,
      right:100
    }
  })
}
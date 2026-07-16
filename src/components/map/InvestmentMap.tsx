'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { gulfCities, GULF_VIEW_BOUNDS, TURKEY_VIEW_BOUNDS } from '@/data/gulfCities';
import { Property, PropertyCategory } from '@/data/properties';
import Navbar from './Navbar';
import CategoryBar from './CategoryBar';
import PropertyGridModal from './PropertyGridModal';
import PropertyQuickViewModal from './PropertyQuickViewModal';
import PropertyConnectorOverlay from './PropertyConnectorOverlay';
import MobileBottomSheet from './MobileBottomSheet';
import HeroIntro from './HeroIntro';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

interface MapCity {
  id: string;
  nameAr: string;
  nameEn: string;
  lat: number;
  lng: number;
  count: number;
}

const DASH_SEQ = [
  [0, 4, 3], [0.5, 4, 2.5], [1, 4, 2], [1.5, 4, 1.5],
  [2, 4, 1], [2.5, 4, 0.5], [3, 4, 0],
  [0, 0.5, 3, 3.5], [0, 1, 3, 3], [0, 1.5, 3, 2.5],
  [0, 2, 3, 2], [0, 2.5, 3, 1.5], [0, 3, 3, 1], [0, 3.5, 3, 0.5],
];

export default function InvestmentMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const animRef = useRef<number | null>(null);
  const panelOpenRef = useRef(false);
  const connectorOpenRef = useRef(false);
  const borderMarkerEls = useRef<HTMLDivElement[]>([]);
  const flyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openCityConnectorRef = useRef<(city: MapCity) => void>(() => {});
  const countElRefs = useRef<Record<string, HTMLSpanElement>>({});
  const innerElRefs = useRef<Record<string, HTMLDivElement>>({});
  const citiesRef = useRef<MapCity[]>([]);
  const activeCityIdRef = useRef<string | null>(null);
  const cityMarkersBuiltRef = useRef(false);
  // Refs to DOM text elements that need to update when language changes
  const gulfNameElsRef = useRef<{ el: HTMLDivElement; cityId: string }[]>([]);
  const gulfCountryElsRef = useRef<{ el: HTMLDivElement; cityId: string }[]>([]);
  const cityLabelElsRef = useRef<{ el: HTMLDivElement; cityId: string }[]>([]);

  const isMobile = useIsMobile();
  const { dir, isAr } = useLanguage();
  const [gridOpen, setGridOpen] = useState(false);
  const [connectorOpen, setConnectorOpen] = useState(false);
  const [markerPoint, setMarkerPoint] = useState<{ x: number; y: number } | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showOverlays, setShowOverlays] = useState(false);
  const [activeCategory, setActiveCategory] = useState<PropertyCategory | 'all'>('all');
  const [cities, setCities] = useState<MapCity[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeCityId, setActiveCityId] = useState<string | null>(null);

  useEffect(() => {
    panelOpenRef.current = gridOpen || connectorOpen;
    connectorOpenRef.current = connectorOpen;
  }, [gridOpen, connectorOpen]);

  useEffect(() => {
    citiesRef.current = cities;
  }, [cities]);

  useEffect(() => {
    activeCityIdRef.current = activeCityId;
  }, [activeCityId]);

  // Şehirleri ve yayındaki ilanları veritabanından çek
  useEffect(() => {
    Promise.all([
      fetch('/api/cities').then(r => r.json()),
      fetch('/api/properties').then(r => r.json()),
    ])
      .then(([citiesData, propertiesData]) => {
        setCities(citiesData);
        setProperties(propertiesData);
      })
      .catch(() => {});
  }, []);

  const activeCity = useMemo(() => cities.find(c => c.id === activeCityId) ?? null, [cities, activeCityId]);
  const activeCityName = isAr ? (activeCity?.nameAr ?? '') : (activeCity?.nameEn ?? '');

  const filteredActiveCityProperties = useMemo(() => {
    if (!activeCity) return [];
    const cityProps = properties.filter(p => p.cityEn === activeCity.nameEn);
    return activeCategory === 'all' ? cityProps : cityProps.filter(p => p.category === activeCategory);
  }, [properties, activeCity, activeCategory]);

  // Update map marker text labels when language changes
  useEffect(() => {
    gulfNameElsRef.current.forEach(({ el, cityId }) => {
      const city = gulfCities.find(c => c.id === cityId);
      if (city) el.textContent = isAr ? city.nameAr : city.nameEn;
    });
    gulfCountryElsRef.current.forEach(({ el, cityId }) => {
      const city = gulfCities.find(c => c.id === cityId);
      if (city) el.textContent = isAr ? city.countryAr : city.countryEn;
    });
    cityLabelElsRef.current.forEach(({ el, cityId }) => {
      const city = citiesRef.current.find(c => c.id === cityId);
      if (city) el.textContent = isAr ? city.nameAr : city.nameEn;
    });
  }, [isAr]);

  // Aktif şehrin paneli açıkken marker'ında glow efekti
  useEffect(() => {
    cities.forEach(city => {
      const inner = innerElRefs.current[city.id];
      if (!inner) return;
      const isActiveGlow = city.id === activeCityId && (gridOpen || connectorOpen);
      if (isActiveGlow) {
        inner.style.animation = 'markerGlow 2s ease-in-out infinite';
        inner.style.background = 'rgba(212,175,55,0.3)';
        inner.style.borderColor = '#FFD700';
        inner.style.boxShadow = '0 0 24px rgba(212,175,55,0.75), 0 0 50px rgba(212,175,55,0.4)';
      } else {
        inner.style.animation = '';
        inner.style.background = 'rgba(212,175,55,0.12)';
        inner.style.borderColor = '#D9BAA0';
        inner.style.boxShadow = '0 0 10px rgba(212,175,55,0.2)';
      }
    });
  }, [gridOpen, connectorOpen, activeCityId, cities]);

  // Kategori filtresi ya da ilan verisi değiştikçe şehirlerin üzerindeki ilan sayılarını güncelle
  useEffect(() => {
    cities.forEach(city => {
      const countEl = countElRefs.current[city.id];
      const inner = innerElRefs.current[city.id];
      if (!countEl || !inner) return;

      const cityProps = properties.filter(p => p.cityEn === city.nameEn);
      const count = activeCategory === 'all' ? cityProps.length : cityProps.filter(p => p.category === activeCategory).length;

      countEl.textContent = String(count);
      countEl.style.animation = 'none';
      void countEl.offsetWidth;
      countEl.style.animation = 'countPulse 0.4s ease';

      inner.style.opacity = count === 0 ? '0.35' : '1';
    });
  }, [activeCategory, properties, cities]);

  const handleClose = useCallback(() => {
    setGridOpen(false);
    setConnectorOpen(false);
    setSelectedProperty(null);
  }, []);

  const handleShowAll = useCallback(() => {
    setConnectorOpen(false);
    setGridOpen(true);
  }, []);

  const handleSelectFromConnector = useCallback((property: Property) => {
    if (isMobile) setConnectorOpen(false);
    setSelectedProperty(property);
  }, [isMobile]);

  const openCityConnector = useCallback((city: MapCity) => {
    const map = mapRef.current;
    if (!map) return;
    if (connectorOpenRef.current && activeCityIdRef.current === city.id) {
      setConnectorOpen(false);
      return;
    }
    setActiveCityId(city.id);
    map.flyTo({ center: [city.lng, city.lat], zoom: 6.5, duration: 1200, essential: true });
    map.once('moveend', () => {
      const point = map.project([city.lng, city.lat]);
      setMarkerPoint({ x: point.x, y: point.y });
      setConnectorOpen(true);
    });
  }, []);

  useEffect(() => {
    openCityConnectorRef.current = openCityConnector;
  }, [openCityConnector]);

  // Scroll lock — modal açıkken sayfanın scroll olmasını engelle
  useEffect(() => {
    const anyModalOpen = gridOpen || !!selectedProperty;
    document.body.style.overflow = anyModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [gridOpen, selectedProperty]);

  // Şehir marker'larını (canlı veriden) inşa eder — hem harita 'load' olduğunda hem de
  // şehir verisi geldiğinde tetiklenir; hangisi son gelirse o inşa eder.
  const buildCityMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map || cityMarkersBuiltRef.current || citiesRef.current.length === 0) return;
    cityMarkersBuiltRef.current = true;
    const currentIsAr = localStorage.getItem('gi_lang') !== 'en';

    citiesRef.current.forEach(city => {
      const wrapper = document.createElement('div');
      Object.assign(wrapper.style, {
        width: '64px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        direction: 'ltr',
        userSelect: 'none',
        position: 'relative',
      });

      const inner = document.createElement('div');
      Object.assign(inner.style, {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: '1.5px solid #D4AF37',
        background: 'rgba(212,175,55,0.12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1px',
        transition: 'transform 0.25s ease, background 0.2s, box-shadow 0.25s',
        pointerEvents: 'none',
        boxShadow: '0 0 8px rgba(212,175,55,0.18)',
        position: 'relative',
        zIndex: '1',
      });

      const countEl = document.createElement('span');
      countEl.textContent = String(city.count);
      Object.assign(countEl.style, {
        color: '#D9BAA0',
        fontSize: '16px',
        fontWeight: '700',
        lineHeight: '1',
        pointerEvents: 'none',
      });

      inner.appendChild(countEl);
      wrapper.appendChild(inner);

      countElRefs.current[city.id] = countEl;
      innerElRefs.current[city.id] = inner;

      const colWrap = document.createElement('div');
      Object.assign(colWrap.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        direction: 'ltr',
      });

      const cityLabel = document.createElement('div');
      cityLabel.textContent = currentIsAr ? city.nameAr : city.nameEn;
      Object.assign(cityLabel.style, {
        color: '#ffffff',
        fontSize: '13px',
        fontWeight: '700',
        textShadow: '0 1px 6px rgba(0,0,0,0.95)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      });

      colWrap.appendChild(cityLabel);
      colWrap.appendChild(wrapper);

      cityLabelElsRef.current.push({ el: cityLabel, cityId: city.id });

      wrapper.addEventListener('mouseenter', () => {
        inner.style.transform = 'scale(1.1)';
        if (!panelOpenRef.current) {
          inner.style.background = 'rgba(212,175,55,0.28)';
          inner.style.boxShadow = '0 0 24px rgba(212,175,55,0.6), 0 0 48px rgba(212,175,55,0.3)';
        }
      });
      wrapper.addEventListener('mouseleave', () => {
        inner.style.transform = 'scale(1)';
        if (!panelOpenRef.current) {
          inner.style.background = 'rgba(212,175,55,0.12)';
          inner.style.boxShadow = '0 0 8px rgba(212,175,55,0.18)';
        }
      });
      wrapper.addEventListener('click', () => {
        openCityConnectorRef.current(city);
      });

      new mapboxgl.Marker({ element: colWrap, anchor: 'bottom' })
        .setLngLat([city.lng, city.lat])
        .addTo(map);
    });
  }, []);

  // Veri geldiğinde (harita zaten yüklenmişse) marker'ları inşa et
  useEffect(() => {
    if (mapRef.current?.loaded()) buildCityMarkers();
  }, [cities, buildCityMarkers]);

  useEffect(() => {
    if (mapRef.current || !containerRef.current || !TOKEN) return;

    mapboxgl.accessToken = TOKEN;

    if (mapboxgl.getRTLTextPluginStatus() === 'unavailable') {
      mapboxgl.setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.3.0/mapbox-gl-rtl-text.js',
        null,
        true,
      );
    }

    const isMobileInit = window.innerWidth <= 768;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      bounds: GULF_VIEW_BOUNDS,
      fitBoundsOptions: { padding: 60 },
      attributionControl: false,
      dragRotate: !isMobileInit,
      pitchWithRotate: false,
      touchPitch: false,
    });

    if (isMobileInit) {
      map.touchZoomRotate.disableRotation();
    }

    mapRef.current = map;

    map.on('load', () => {
      // Read initial isAr from DOM since useLanguage is not available in effect
      const currentIsAr = localStorage.getItem('gi_lang') !== 'en';

      map.getStyle().layers?.forEach(layer => {
        if (layer.type === 'symbol' && layer.layout && 'text-field' in layer.layout) {
          map.setLayoutProperty(layer.id, 'text-field', [
            'coalesce',
            ['get', 'name_ar'],
            ['get', 'name_en'],
            ['get', 'name'],
          ]);
        }
      });

      // ── Connection lines ──────────────────────────────────────────────
      map.addSource('connections', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: gulfCities.map(city => ({
            type: 'Feature' as const,
            geometry: {
              type: 'LineString' as const,
              coordinates: [city.coordinates, city.borderTarget],
            },
            properties: {},
          })),
        },
      });

      map.addLayer({
        id: 'connection-glow',
        type: 'line',
        source: 'connections',
        paint: {
          'line-color': '#D9BAA0',
          'line-width': 12,
          'line-opacity': 0,
          'line-opacity-transition': { duration: 1200 },
          'line-blur': 12,
        },
      });

      map.addLayer({
        id: 'connection-lines',
        type: 'line',
        source: 'connections',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#D9BAA0',
          'line-width': 1.8,
          'line-opacity': 0,
          'line-opacity-transition': { duration: 1200 },
          'line-dasharray': DASH_SEQ[0],
        },
      });

      // ── Turkey border ──
      const turkeyBorderFilter: mapboxgl.FilterSpecification = [
        'all',
        ['==', ['get', 'iso_3166_1'], 'TR'],
        ['==', ['get', 'disputed'], 'false'],
        ['in', 'US', ['get', 'worldview']],
      ];

      map.addSource('country-boundaries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
      });

      map.addLayer({
        id: 'turkey-border-glow',
        type: 'line',
        source: 'country-boundaries',
        'source-layer': 'country_boundaries',
        filter: turkeyBorderFilter,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#D9BAA0',
          'line-width': 12,
          'line-opacity': 0,
          'line-opacity-transition': { duration: 1200 },
          'line-blur': 12,
        },
      });

      map.addLayer({
        id: 'turkey-border',
        type: 'line',
        source: 'country-boundaries',
        'source-layer': 'country_boundaries',
        filter: turkeyBorderFilter,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#D9BAA0',
          'line-width': 1.8,
          'line-opacity': 0,
          'line-opacity-transition': { duration: 1200 },
          'line-dasharray': DASH_SEQ[0],
        },
      });

      let step = 0;
      let lastTs = 0;
      function animateDash(ts: number) {
        if (ts - lastTs > 65) {
          lastTs = ts;
          step = (step + 1) % DASH_SEQ.length;
          if (map.getLayer('connection-lines'))
            map.setPaintProperty('connection-lines', 'line-dasharray', DASH_SEQ[step]);
          if (map.getLayer('turkey-border'))
            map.setPaintProperty('turkey-border', 'line-dasharray', DASH_SEQ[step]);
        }
        animRef.current = requestAnimationFrame(animateDash);
      }
      animRef.current = requestAnimationFrame(animateDash);

      // ── Gulf city markers ─────────────────────────────────────────────
      gulfCities.forEach(city => {
        const el = document.createElement('div');
        Object.assign(el.style, { direction: 'ltr', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'default' });

        const nameEl = document.createElement('div');
        nameEl.textContent = currentIsAr ? city.nameAr : city.nameEn;
        Object.assign(nameEl.style, {
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: '600',
          textShadow: '0 1px 4px rgba(0,0,0,0.9)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          lineHeight: '1',
        });

        const dot = document.createElement('div');
        Object.assign(dot.style, {
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 0 8px 3px rgba(255,255,255,0.6), 0 0 16px 5px rgba(255,255,255,0.25)',
          pointerEvents: 'none',
        });

        const countryEl = document.createElement('div');
        countryEl.textContent = currentIsAr ? city.countryAr : city.countryEn;
        Object.assign(countryEl.style, {
          color: 'rgba(255,255,255,0.55)',
          fontSize: '9px',
          fontWeight: '400',
          textShadow: '0 1px 4px rgba(0,0,0,0.9)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          lineHeight: '1',
        });

        el.appendChild(nameEl);
        el.appendChild(dot);
        el.appendChild(countryEl);

        // Store refs for language updates
        gulfNameElsRef.current.push({ el: nameEl, cityId: city.id });
        gulfCountryElsRef.current.push({ el: countryEl, cityId: city.id });

        new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat(city.coordinates)
          .addTo(map);
      });

      // ── Border entry points ──
      gulfCities.forEach(city => {
        const wrapper = document.createElement('div');
        Object.assign(wrapper.style, {
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          position: 'relative',
          opacity: '0',
          transition: 'opacity 1.2s ease',
        });
        borderMarkerEls.current.push(wrapper);

        const ring = document.createElement('div');
        Object.assign(ring.style, {
          position: 'absolute',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: '1.5px solid #D4AF37',
          animation: 'borderPulse 2s ease-out infinite',
        });

        const dot = document.createElement('div');
        Object.assign(dot.style, {
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#D9BAA0',
          boxShadow: '0 0 8px 2px rgba(212,175,55,0.7), 0 0 16px rgba(212,175,55,0.4)',
        });

        wrapper.appendChild(ring);
        wrapper.appendChild(dot);

        new mapboxgl.Marker({ element: wrapper, anchor: 'center' })
          .setLngLat(city.borderTarget)
          .addTo(map);
      });

      // Aktif şehir hareket ederken bağlantı çizgisinin ucunu güncelle
      map.on('move', () => {
        if (!connectorOpenRef.current || !activeCityIdRef.current) return;
        const city = citiesRef.current.find(c => c.id === activeCityIdRef.current);
        if (!city) return;
        const point = map.project([city.lng, city.lat]);
        setMarkerPoint({ x: point.x, y: point.y });
      });

      // ── Şehir marker'ları: canlı veri gelmişse hemen, gelmemişse veri geldiğinde ──
      buildCityMarkers();

      // ── Intro animation: Gulf → Turkey camera transition ──────────────
      flyTimeoutRef.current = setTimeout(() => {
        const liveCities = citiesRef.current;
        let bounds = TURKEY_VIEW_BOUNDS;
        if (liveCities.length > 0) {
          const lats = liveCities.map(c => c.lat);
          const lngs = liveCities.map(c => c.lng);
          const pad = 0.6;
          bounds = [
            [Math.min(...lngs) - pad, Math.min(...lats) - pad],
            [Math.max(...lngs) + pad, Math.max(...lats) + pad],
          ];
        }
        const cam = map.cameraForBounds(bounds, { padding: 60 });
        if (cam) map.flyTo({ ...cam, duration: 3000, essential: true });

        map.once('moveend', () => {
          map.setPaintProperty('connection-glow', 'line-opacity', 0.1);
          map.setPaintProperty('connection-lines', 'line-opacity', 0.85);
          map.setPaintProperty('turkey-border-glow', 'line-opacity', 0.1);
          map.setPaintProperty('turkey-border', 'line-opacity', 0.85);
          borderMarkerEls.current.forEach(el => { el.style.opacity = '1'; });
          setShowOverlays(true);
        });
      }, 1800);
    });

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (flyTimeoutRef.current) clearTimeout(flyTimeoutRef.current);
      map.remove();
      mapRef.current = null;
    };
  }, [buildCityMarkers]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#050814', overflow: 'hidden' }}>
      {/* Map canvas */}
      <div ref={containerRef} dir="ltr" style={{ position: 'absolute', inset: 0 }} />

      {/* Turkey label */}
      <div
        style={{
          position: 'absolute',
          left: '42%',
          top: '38%',
          transform: 'translate(-50%, -50%)',
          color: 'rgba(212,175,55,0.1)',
          fontSize: '4.5rem',
          fontWeight: 800,
          letterSpacing: '0.25em',
          pointerEvents: 'none',
          zIndex: 2,
          direction: 'ltr',
          userSelect: 'none',
          textShadow: '0 0 40px rgba(212,175,55,0.08)',
          opacity: showOverlays ? 1 : 0,
          transition: 'opacity 1.2s ease',
        }}
      >
        {isAr ? 'تركيا' : 'TURKEY'}
      </div>

      {/* Hero overlay — visible until city is selected */}
      <HeroIntro
        visible={showOverlays && !connectorOpen && !gridOpen}
        onExplore={() => {
          const first = citiesRef.current[0];
          if (first) openCityConnectorRef.current(first);
        }}
      />

      <Navbar />
      <CategoryBar active={activeCategory} onChange={setActiveCategory} />

      {/* Connector overlay or mobile bottom sheet */}
      {connectorOpen && !gridOpen && (
        isMobile ? (
          <MobileBottomSheet
            properties={filteredActiveCityProperties}
            cityName={activeCityName}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onSelectProperty={handleSelectFromConnector}
            onClose={() => setConnectorOpen(false)}
          />
        ) : (
          <PropertyConnectorOverlay
            cityName={activeCityName}
            properties={filteredActiveCityProperties}
            markerPoint={markerPoint}
            onSelectProperty={handleSelectFromConnector}
            onShowAll={handleShowAll}
            onClose={() => setConnectorOpen(false)}
          />
        )
      )}

      {/* Grid modal */}
      {gridOpen && (
        <PropertyGridModal
          cityName={activeCityName}
          properties={filteredActiveCityProperties}
          onClose={handleClose}
          onSelectProperty={setSelectedProperty}
        />
      )}

      {/* Quick view modal */}
      {selectedProperty && (
        <PropertyQuickViewModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      {!TOKEN && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#050814',
            color: '#D9BAA0',
            fontSize: '0.9rem',
            direction: 'ltr',
            zIndex: 99,
          }}
        >
          Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local
        </div>
      )}
    </div>
  );
}

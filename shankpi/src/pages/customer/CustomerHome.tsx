import { useEffect, useMemo, useState } from 'react'
import { Search, Navigation } from 'lucide-react'
import { ShopCard } from '../../components/shops/ShopCard'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import { getAllShops, getAreas, getShopsByArea } from '../../api/services'
import type { Shop } from '../../types'
import {
  calculateHaversineDistance,
  findClosestArea,
  getMockShopCoordinates,
} from '../../utils/locationUtils'

export function CustomerHome() {
  const { user } = useApp()
  const { t, language } = useTranslation()
  const [search, setSearch] = useState('')
  const [shops, setShops] = useState<Shop[]>([])
  const [selectedArea, setSelectedArea] = useState('All')
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'distance'>('name')
  const [areas, setAreas] = useState([]);

  useEffect(() =>{
    
    getAreas().then((data)=> setAreas(data))
  },[])
  

  useEffect(() => {
    let tem;
    if(selectedArea == "All"){
      tem = getAllShops();
      console.log("All:"+tem);
    }
    else{
      tem = getShopsByArea(selectedArea);
      console.log("All:"+tem);
    }
    
    
      tem.then((data) => {
        const mapped: Shop[] = data.map((s: any) => {
          const coords = getMockShopCoordinates(s.id, s.area || selectedArea)
          return {
            id: s.id,
            name: s.name,
            nameMr: s.name,
            area: s.area || selectedArea,
            areaMr: s.area || selectedArea,
            isOpen: s.isOpen,
            whatsapp: s.whatsappNumber ?? '',
            latitude: coords.lat,
            longitude: coords.lng,
          }
        })
        setShops(mapped)
      })
      .catch(console.error)
  }, [selectedArea])

  const shopsWithDistance = useMemo(() => {
    return shops.map((shop) => {
      if (userCoords && shop.latitude && shop.longitude) {
        const dist = calculateHaversineDistance(userCoords, {
          lat: shop.latitude,
          lng: shop.longitude,
        })
        return { ...shop, distance: dist }
      }
      return shop
    })
  }, [shops, userCoords])

  const filteredAndSorted = useMemo(() => {
    const q = search.toLowerCase()
    let result = shopsWithDistance

    if (q) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.area.toLowerCase().includes(q),
      )
    }

    if (sortBy === 'distance' && userCoords) {
      return [...result].sort((a, b) => {
        const distA = a.distance ?? Infinity
        const distB = b.distance ?? Infinity
        return distA - distB
      })
    } else {
      return [...result].sort((a, b) => {
        const nameA = language === 'mr' ? a.nameMr : a.name
        const nameB = language === 'mr' ? b.nameMr : b.name
        return nameA.localeCompare(nameB, language)
      })
    }
  }, [search, shopsWithDistance, sortBy, userCoords, language])

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }
    setIsDetecting(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setUserCoords(coords)
        const closest = findClosestArea(coords)
        setSelectedArea(closest)
        setSortBy('distance')
        setIsDetecting(false)
      },
      (error) => {
        console.error('Error detecting location:', error)
        setIsDetecting(false)
        alert('Could not detect location. Please allow location access.')
      },
      { enableHighAccuracy: true, timeout: 5000 },
    )
  }

  return (
    <div className="px-4 py-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-warm-900 lg:text-3xl">
          {t('namaste')}, {user.name.split(' ')[0]} 👋
        </h1>
        <div className="relative mt-4">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-warm-800/40"
            size={20}
          />
          <input
            type="search"
            placeholder={t('searchShop')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-h-12 w-full rounded-2xl border-2 border-warm-200 bg-white py-3 pl-12 pr-4 text-base outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 rounded-2xl border-2 border-warm-200 bg-white px-3 py-2 text-sm focus-within:border-saffron">
            <span className="text-warm-800/60 font-medium">{t('selectArea')}:</span>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="bg-transparent font-semibold text-warm-900 outline-none cursor-pointer"
            >
              <option value="All">All</option>
              { areas.map((a) => ( 
                <option value={a}>{a}</option>
              )) }
            </select>
          </div>

          <button
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
              userCoords
                ? 'bg-forest/10 text-forest hover:bg-forest/20'
                : 'bg-saffron text-white hover:bg-saffron/90 shadow-button'
            } disabled:opacity-50`}
          >
            <Navigation size={16} className={isDetecting ? 'animate-spin' : ''} />
            {isDetecting ? t('detecting') : userCoords ? t('locationDetected') : t('useMyLocation')}
          </button>

          <div className="flex items-center gap-2 rounded-2xl border-2 border-warm-200 bg-white px-3 py-2 text-sm focus-within:border-saffron">
            <span className="text-warm-800/60 font-medium">{t('sortBy')}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'distance')}
              className="bg-transparent font-semibold text-warm-900 outline-none cursor-pointer"
            >
              <option value="name">{t('sortByName')}</option>
              {userCoords && <option value="distance">{t('sortByDistance')}</option>}
            </select>
          </div>
        </div>
      </header>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-warm-900">{t('browseNearby')}</h2>
        {filteredAndSorted.length === 0 ? (
          <p className="py-12 text-center text-warm-800/60">No shops found</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSorted.map((shop) => (
              <ShopCard key={shop.id} shop={shop} variant="grid" />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

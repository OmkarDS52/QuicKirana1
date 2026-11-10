package com.example.Kirana.Service;

import com.example.Kirana.DTOs.Requests.ShopRequest;
import com.example.Kirana.DTOs.Response.ShopResponse;
import com.example.Kirana.Entity.Shop;
import com.example.Kirana.Entity.User;
import com.example.Kirana.Repository.ShopRepository;
import com.example.Kirana.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;

    // Shop owner creates their shop
    public ShopResponse createShop(String ownerId, ShopRequest request) {

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Shop shop = Shop.builder()
                .owner(owner)
                .name(request.getName())
                .address(request.getAddress())
                .area(request.getArea())
                .city(request.getCity() != null ? request.getCity() : "Kolhapur")
                .phone(request.getPhone())
                .whatsappNumber(request.getWhatsappNumber())
                .isOpen(true)
                .isActive(true)
                .build();

        shopRepository.save(shop);
        return mapToResponse(shop);
    }

    // Get single shop by id
    public ShopResponse getShopById(String shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
        return mapToResponse(shop);
    }

    // Get all shops by area
    public List<ShopResponse> getShopsByArea(String area) {
        return shopRepository.findByAreaAndIsActiveTrue(area)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Shop owner gets their own shop
    public ShopResponse getMyShop(String ownerId) {
        return shopRepository.findByOwnerIdAndIsActiveTrue(ownerId)
                .stream()
                .findFirst()
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("No shop found for this owner"));
    }

    // Shop owner updates shop details
    public ShopResponse updateShop(String ownerId, ShopRequest request) {
        Shop shop = shopRepository.findByOwnerIdAndIsActiveTrue(ownerId)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        shop.setName(request.getName());
        shop.setAddress(request.getAddress());
        shop.setArea(request.getArea());
        shop.setPhone(request.getPhone());
        shop.setWhatsappNumber(request.getWhatsappNumber());

        shopRepository.save(shop);
        return mapToResponse(shop);
    }

    // Toggle shop open/closed
    public ShopResponse toggleShopStatus(String ownerId) {
        Shop shop = shopRepository.findByOwnerIdAndIsActiveTrue(ownerId)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        shop.setIsOpen(!shop.getIsOpen());
        shopRepository.save(shop);
        return mapToResponse(shop);
    }

    private ShopResponse mapToResponse(Shop shop) {
        return ShopResponse.builder()
                .id(shop.getId())
                .name(shop.getName())
                .address(shop.getAddress())
                .area(shop.getArea())
                .city(shop.getCity())
                .phone(shop.getPhone())
                .whatsappNumber(shop.getWhatsappNumber())
                .isOpen(shop.getIsOpen())
                .ownerId(shop.getOwner().getId())
                .ownerName(shop.getOwner().getName())
                .build();
    }

	public List<ShopResponse> getAllShops() {
		// TODO Auto-generated method stub
		System.out.println(shopRepository.findAll()
				.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList()));
		return shopRepository.findAll()
				.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
		
	}

	public List<String> getAreas() {
		List<String> areas = new ArrayList<>();
		List<Shop> sh = shopRepository.findAll();
		for(Shop s : sh) {
			areas.add(s.getArea());
		}
		return areas;
	}
}
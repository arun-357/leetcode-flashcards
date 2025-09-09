import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ParkingLot {
    private static ParkingLot instance;
    private List<Floor> floors = new ArrayList<>();
    private Map<String, ParkingTicket> activeTickets = new HashMap<>();
    private FeesStrategy feesStrategy;

    private ParkingLot(FeesStrategy strategy) {
        this.feesStrategy = strategy;
    }

    public static synchronized ParkingLot getInstance(FeesStrategy strategy) {
        if (instance == null) {
            instance = new ParkingLot(strategy);
        }
        return instance;
    }

    public void addFloor(Floor f) {
        floors.add(f);
    }

    public ParkingTicket parkVehicle(Vehicle v) {
        for (Floor f: floors) {
            ParkingSpot spot = f.findAvailableSpot(v);
            if (spot != null) {
                spot.assignVehicle(v);
                ParkingTicket ticket = new ParkingTicket(spot, v);
                activeTickets.put(v.getLicensePlate(), ticket);
                return ticket;
            }
        }
        throw new RuntimeException("No available spot for " + v.getClass().getSimpleName());
    }

    public double unparkVehicle(String plate) {
        ParkingTicket ticket = activeTickets.remove(plate);
        if (ticket == null) throw new RuntimeException("Ticket not found!");
        ticket.getSpot().unassignVehicle();
        return feesStrategy.calculateFee(ticket.getEntryTime(), LocalDateTime.now());
    }
}

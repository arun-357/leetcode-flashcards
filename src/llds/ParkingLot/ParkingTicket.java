import java.time.LocalDateTime;
import java.util.UUID;

public class ParkingTicket {
    private String ticketId;
    private LocalDateTime entryTime;
    private ParkingSpot spot;
    private Vehicle vehicle;

    public ParkingTicket(ParkingSpot spot, Vehicle vehicle) {
        this.ticketId = UUID.randomUUID().toString();
        this.entryTime = LocalDateTime.now();
        this.spot = spot;
        this.vehicle = vehicle;
    }

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public ParkingSpot getSpot() {
        return spot;
    }

    public String getTicketId() {
        return ticketId;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }
}

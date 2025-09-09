import java.lang.invoke.VarHandle;
import java.util.ArrayList;
import java.util.List;

public class Floor {
    private List<ParkingSpot> spots = new ArrayList<>();

    public void addSpot(ParkingSpot spot) {
        spots.add(spot);
    }

    public ParkingSpot findAvailableSpot(Vehicle v) {
        for (ParkingSpot s : spots) {
            if (s.getIsavailable() && s.canFitVehicle(v)) {
                return s;
            }
        }
        return null;
    }
}

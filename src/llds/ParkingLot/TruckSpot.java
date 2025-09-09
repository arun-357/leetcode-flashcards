public class TruckSpot extends ParkingSpot {
    public TruckSpot(String id) {
        super(id);
    }

    @Override
    public boolean canFitVehicle(Vehicle v) {
        return v instanceof Truck;
    }
}

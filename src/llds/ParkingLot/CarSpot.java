public class CarSpot extends ParkingSpot {
    public CarSpot(String id) {
        super(id);
    }

    @Override
    public boolean canFitVehicle(Vehicle v) {
        return v instanceof Car;
    }
}

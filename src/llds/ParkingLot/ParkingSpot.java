abstract class ParkingSpot {
    private String id;
    private Vehicle vehicle;
    private boolean isavailable = true;

    public ParkingSpot(String id) {
        this.id = id;
    }

    public Boolean getIsavailable() {
        return isavailable;
    }

    public void assignVehicle(Vehicle v) {
        this.isavailable = false;
        this.vehicle = v;
    }

    public void unassignVehicle() {
        this.isavailable = true;
        this.vehicle = null;
    }

    public boolean canFitVehicle(Vehicle v) {
        return false;
    }
}

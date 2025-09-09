public class Main {
    public static void main(String[] args) throws InterruptedException {
        // Step 1: Choose a fee strategy
        FeesStrategy feeStrategy = new FlatFeeStrategy(20.0); // 20 Rs per hour

        // Step 2: Initialize parking lot (Singleton)
        ParkingLot lot = ParkingLot.getInstance(feeStrategy);

        // Step 3: Create floors with spots
        Floor floor1 = new Floor();
        floor1.addSpot(new CarSpot("C1"));
        floor1.addSpot(new CarSpot("C2"));

        Floor floor2 = new Floor();
        floor2.addSpot(new TruckSpot("T1"));
        floor2.addSpot(new CarSpot("C3"));

        lot.addFloor(floor1);
        lot.addFloor(floor2);

        // Step 4: Create vehicles
        Vehicle car = new Car("KA-01-1234");
        Vehicle truck = new Truck("KA-03-9999");

        // Step 5: Park vehicles
        System.out.println("Parking car...");
        ParkingTicket carTicket = lot.parkVehicle(car);
        System.out.println("Car parked at: " + carTicket.getSpot().getClass().getSimpleName());

        System.out.println("Parking truck...");
        ParkingTicket truckTicket = lot.parkVehicle(truck);
        System.out.println("Truck parked at: " + truckTicket.getSpot().getClass().getSimpleName());

        // Wait for a while (simulate parking time)
        Thread.sleep(2000);

        // Step 6: Unpark vehicles and calculate fee
        System.out.println("Unparking car...");
        double carFee = lot.unparkVehicle(car.getLicensePlate());
        System.out.println("Car Fee: " + carFee);

        System.out.println("Unparking truck...");
        double truckFee = lot.unparkVehicle(truck.getLicensePlate());
        System.out.println("Truck Fee: " + truckFee);
    }
}

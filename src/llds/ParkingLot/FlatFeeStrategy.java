import java.time.LocalDateTime;

public class FlatFeeStrategy implements FeesStrategy {
    private double flatRate;

    public FlatFeeStrategy(double flatRate) {
        this.flatRate = flatRate;
    }

    @Override
    public double calculateFee(LocalDateTime entryTime, LocalDateTime exitTime) {
        return flatRate;
    }
}

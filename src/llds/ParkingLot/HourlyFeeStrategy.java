import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public class HourlyFeeStrategy implements FeesStrategy {
    private double hourlyRate;

    public HourlyFeeStrategy(double rate) {
        this.hourlyRate = rate;
    }

    @Override
    public double calculateFee(LocalDateTime entryTime, LocalDateTime exitTime) {
        return ChronoUnit.HOURS.between(entryTime, exitTime) * hourlyRate;
    }
}

import java.time.LocalDateTime;

interface FeesStrategy {
    double calculateFee(LocalDateTime entryTime, LocalDateTime exitTime);
}

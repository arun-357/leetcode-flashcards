import java.util.List;
import java.util.Map;

public interface PostFeedGenerationStrategy {
    List<Post> getPostFeed(String userId, Map<String, List<Post>> feedMap);
}

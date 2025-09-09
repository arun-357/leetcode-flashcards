import java.util.Collections;
import java.util.List;
import java.util.Map;

public class ChronologicalStrategy implements PostFeedGenerationStrategy {
    @Override
    public List<Post> getPostFeed(String userId, Map<String, List<Post>> feedMap) {
        return feedMap.getOrDefault(userId, Collections.emptyList());
    }
}
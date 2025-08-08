import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";

export function TicksSummary(props: {
  totalCount: number;
  flashCount: number;
  repeatCount: number;
  hardestGrade: string;
  last30Count: number;
  filteredCount: number;
}) {
  const {
    totalCount,
    flashCount,
    repeatCount,
    hardestGrade,
    last30Count,
    filteredCount,
  } = props;

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span>
            <strong>{filteredCount}</strong> shown
            {filteredCount !== totalCount && (
              <span className="text-muted-foreground"> of {totalCount}</span>
            )}
          </span>
          <span className="text-muted-foreground">•</span>
          <span>
            <strong>{flashCount}</strong> flashes
          </span>
          <span className="text-muted-foreground">•</span>
          <span>
            <strong>{repeatCount}</strong> repeats
          </span>
          <span className="text-muted-foreground">•</span>
          <span>
            <strong>{last30Count}</strong> last 30 days
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Hardest</span>
          <Badge variant="secondary" className="text-sm font-semibold">
            {hardestGrade}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

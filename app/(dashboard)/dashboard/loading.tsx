import Loader from '@/app/components/ui/Loader';

export default function DashboardLoading() {
  return (
    <div className="flex h-full items-center justify-center py-24">
      <Loader message="Loading your studio..." fullScreen={false} />
    </div>
  );
}
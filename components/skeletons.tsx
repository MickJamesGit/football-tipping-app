// Loading animation
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function DashboardSkeleton() {
  return (
    <>
      <UserHeadingSkeleton />
      <DashboardCardsSkeleton />
      <UpcomingGamesSkeleton />
    </>
  );
}

export function UpcomingGamesSkeleton() {
  return (
    <div className="grid gap-4 mx-auto max-w-screen-lg">
      {/* Skeleton for Upcoming Games Header */}
      <div
        className={`w-1/3 h-6 bg-gray-300 rounded mx-auto ${shimmer} relative mb-4`}
      ></div>

      {/* Skeleton for Game Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-lg border p-4 flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 bg-gray-300 rounded-full ${shimmer} relative`}
                  ></div>
                  <div
                    className={`w-20 h-6 bg-gray-300 rounded ${shimmer} relative`}
                  ></div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`w-20 h-6 bg-gray-300 rounded ${shimmer} relative`}
                  ></div>
                  <div
                    className={`w-10 h-10 bg-gray-300 rounded-full ${shimmer} relative`}
                  ></div>
                </div>
              </div>
              <div className="text-center mb-4">
                <div
                  className={`w-32 h-4 bg-gray-300 rounded mx-auto ${shimmer} relative mb-2`}
                ></div>
                <div
                  className={`w-24 h-4 bg-gray-300 rounded mx-auto ${shimmer} relative mb-2`}
                ></div>
                <div
                  className={`w-16 h-4 bg-gray-300 rounded mx-auto ${shimmer} relative`}
                ></div>
              </div>
              <div className="self-center w-32 h-10 bg-gray-300 rounded ${shimmer} relative"></div>
            </div>
          ))}
      </div>
    </div>
  );
}

export function DashboardCardsSkeleton() {
  return (
    <div className="flex justify-center p-4 pt-6">
      <div
        className={`grid gap-6 w-full max-w-7xl grid-cols-1 lg:grid-cols-2 justify-items-center`}
      >
        {Array(2)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="w-full h-40 bg-gray-300 rounded-lg ${shimmer} relative"
            ></div>
          ))}
      </div>
    </div>
  );
}

export function UserHeadingSkeleton() {
  return (
    <div className="w-full bg-gray-50 p-4 rounded-lg flex items-center">
      {/* Skeleton for Avatar */}
      <div
        className={`w-16 h-16 bg-gray-300 rounded-full ${shimmer} relative`}
      ></div>

      {/* Skeleton for User Info */}
      <div className="ml-4">
        <div
          className={`w-32 h-6 bg-gray-300 rounded ${shimmer} relative mb-2`}
        ></div>
        <div
          className={`w-48 h-4 bg-gray-300 rounded ${shimmer} relative`}
        ></div>
      </div>
    </div>
  );
}

export function TippingTableSkeleton() {
  return (
    <div>
      <form>
        <div className="border rounded-lg overflow-hidden relative">
          {/* Skeleton for Header */}
          <div
            className={`bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between ${shimmer} relative`}
          >
            <div className="flex items-center gap-4">
              <div className="w-1/4 h-6 bg-gray-300 rounded"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 h-6 bg-gray-300 rounded"></div>
              <div className="w-24 h-6 bg-gray-300 rounded"></div>
            </div>
          </div>

          {/* Skeleton for Table */}
          <div className="bg-white">
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="w-full h-4 bg-gray-300 rounded"></div>
                <div className="w-full h-4 bg-gray-300 rounded text-center"></div>
                <div className="w-full h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="p-4 grid grid-cols-3 gap-4 items-center border-t"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                    </div>
                    <div className="w-full h-4 bg-gray-300 rounded text-center"></div>
                    <div className="flex items-center gap-2 justify-end">
                      <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Skeleton for Save Button */}
          <div className="flex justify-end mt-4 px-4 pb-4">
            <div
              className={`w-24 h-10 bg-gray-300 rounded ${shimmer} relative`}
            ></div>
          </div>
        </div>
      </form>
    </div>
  );
}

export function AccountLayoutSkeleton() {
  return (
    <div>
      {/* Skeleton for My Account Header */}
      <div
        className={`bg-primary py-4 px-6 rounded-lg text-2xl font-bold text-primary-foreground ${shimmer} relative`}
      >
        <div className="w-1/4 h-6 bg-gray-300 rounded"></div>
      </div>

      <div className="container mx-auto py-12 px-4 md:px-6">
        {/* Skeleton for User Info Section */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className={`h-16 w-16 bg-gray-300 rounded-full ${shimmer} relative`}
          ></div>
          <div className="grid gap-1">
            <div
              className={`w-1/4 h-6 bg-gray-300 rounded ${shimmer} relative`}
            ></div>
            <div
              className={`w-1/3 h-4 bg-gray-300 rounded ${shimmer} relative`}
            ></div>
          </div>
        </div>

        {/* Skeleton for Form */}
        <div className="grid gap-8">
          {/* Account Details Section */}
          <div>
            <div
              className={`w-1/4 h-5 bg-gray-300 rounded ${shimmer} relative mb-4`}
            ></div>
            <div className="space-y-4">
              <div className="grid gap-2">
                <div
                  className={`w-1/5 h-4 bg-gray-300 rounded ${shimmer} relative`}
                ></div>
                <div
                  className={`w-full md:w-96 h-10 bg-gray-300 rounded ${shimmer} relative`}
                ></div>
              </div>
            </div>
          </div>

          {/* Communication Preferences Section */}
          <div>
            <div
              className={`w-1/4 h-5 bg-gray-300 rounded ${shimmer} relative mb-4`}
            ></div>
            <div className="space-y-4">
              <div className="items-top flex gap-2">
                <div
                  className={`h-6 w-6 bg-gray-300 rounded ${shimmer} relative`}
                ></div>
                <div className="grid gap-1.5 leading-none">
                  <div
                    className={`w-1/5 h-4 bg-gray-300 rounded ${shimmer} relative`}
                  ></div>
                  <div
                    className={`w-1/2 h-4 bg-gray-300 rounded ${shimmer} relative`}
                  ></div>
                </div>
              </div>
              <div className="items-top flex gap-2">
                <div
                  className={`h-6 w-6 bg-gray-300 rounded ${shimmer} relative`}
                ></div>
                <div className="grid gap-1.5 leading-none">
                  <div
                    className={`w-1/5 h-4 bg-gray-300 rounded ${shimmer} relative`}
                  ></div>
                  <div
                    className={`w-1/2 h-4 bg-gray-300 rounded ${shimmer} relative`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton for Save Changes Button */}
        <div className="flex justify-end mt-8">
          <div
            className={`w-24 h-10 bg-gray-300 rounded ${shimmer} relative`}
          ></div>
        </div>
      </div>
    </div>
  );
}

export function LeaderBoardTableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Skeleton for Leaderboard Header */}
      <div className={`bg-primary py-4 px-6 rounded-lg ${shimmer} relative`}>
        <div className="w-1/4 h-6 bg-gray-300 rounded"></div>
      </div>

      {/* Skeleton for Search and Filter Row */}
      <div className="flex items-center justify-between">
        <div
          className={`w-[40%] h-10 bg-gray-300 rounded ${shimmer} relative`}
        ></div>
        <div
          className={`w-[200px] h-10 bg-gray-300 rounded ${shimmer} relative`}
        ></div>
      </div>

      {/* Skeleton for Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full bg-white shadow rounded-lg">
          <div className="bg-gray-200 border-b border-gray-200">
            <div className="flex justify-between p-4">
              <div className="w-[80px] h-4 bg-gray-300 rounded ${shimmer}"></div>
              <div className="w-[100px] h-4 bg-gray-300 rounded ${shimmer}"></div>
              <div className="w-[100px] h-4 bg-gray-300 rounded ${shimmer} text-right"></div>
              <div className="w-[100px] h-4 bg-gray-300 rounded ${shimmer} text-right"></div>
            </div>
          </div>
          <div>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 border-b border-gray-200"
                >
                  <div
                    className={`w-[80px] h-6 bg-gray-300 rounded ${shimmer} relative`}
                  ></div>
                  <div
                    className={`flex items-center gap-2 w-[200px] h-6 bg-gray-300 rounded ${shimmer} relative`}
                  ></div>
                  <div
                    className={`w-[100px] h-6 bg-gray-300 rounded ${shimmer} relative text-right`}
                  ></div>
                  <div
                    className={`w-[100px] h-6 bg-gray-300 rounded ${shimmer} relative text-right`}
                  ></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SportsCompetitionLayoutSkeleton() {
  return (
    <div className="w-full">
      {/* Skeleton for My Sports section */}
      <div
        className={`bg-primary py-4 px-6 rounded-lg text-2xl font-bold text-primary-foreground ${shimmer} relative`}
      >
        <div className="w-1/4 h-6 bg-gray-300 rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className={`w-full h-40 bg-gray-300 rounded-lg ${shimmer} relative`}
            ></div>
          ))}
      </div>

      {/* Skeleton for Other Sports section */}
      <div className="text-2xl font-bold text-left mt-6 mb-4 pb-2 bg-primary flex items-center gap-2 text-white p-2 rounded-lg shadow-md">
        <div
          className={`w-1/4 h-6 bg-gray-300 rounded ${shimmer} relative`}
        ></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className={`w-full h-40 bg-gray-300 rounded-lg ${shimmer} relative`}
            ></div>
          ))}
      </div>
    </div>
  );
}

const ID = 138192593;


export type LiveStatus =
  | { status: "LIVE"; slug: string }
  | { status: "OFFLINE"; slug: string };

export async function get_live_data(
  id: number = ID,
): Promise<LiveStatus> {
  const res = await fetch(
    `https://live.nicovideo.jp/front/api/v2/user-broadcast-history?providerId=${id}&providerType=user&isIncludeNonPublic=false&offset=0&limit=${10}&withTotalCount=true`,
  );

  if (!res.ok) {
    console.error("Error fetching data from API");
    throw Error();
  }
  const data = (await res.json()).data.programsList as {
    id: {
      value: string;
    };
    program: {
      schedule: {
        status: string;
      };
    };
  }[];
  const result = data.find((e) => e.program.schedule.status === "ON_AIR");

  if (result) {
    return {
      status: "LIVE",
      slug: result.id.value,
    } as const;
  } else {
    return {
      status: "OFFLINE",
      slug: ""
    }
  }

}

export async function get_cookies(
  url: string,
) {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  const cookies = res.headers.get("set-cookie");
  if (!cookies) {
    console.error("No cookies found");
    throw new Error("No cookies found");
  }
  return cookies;
}

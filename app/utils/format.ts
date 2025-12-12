/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import { formatNumber } from "./helper";
import type {
  MonitorsDataResult,
  SiteDaysStatus,
  SiteStatusType,
} from "~~/types/main";

/**
 * Format site data.
 * @param data The site data to format.
 * @returns The formatted site data.
 */
export const formatSiteData = (
  data: any,
  dates: dayjs.Dayjs[],
): MonitorsDataResult | undefined => {
  if (!data?.monitors) return undefined;
  const { public: configPublic } = useRuntimeConfig();
  // use `showLinks` (env SHOW_LINKS) to control whether links are exposed by default
  // If showLinks is false, we still expose URL for HTTP-type monitors (type === 1)
  const { showLinks } = configPublic as any;
  const sites: any[] = data.monitors;
  // 解析站点数据
  const formatData = sites?.map((site: any): SiteStatusType => {
    // 解析每日数据
    const ranges = site.custom_uptime_ranges.split("-");
    const percent = formatNumber(ranges.pop() || 0);
    const dailyData: SiteDaysStatus[] = [];
    const timeMap = new Map();
    // 处理每日数据
    dates.forEach((date, index) => {
      timeMap.set(date.format("YYYYMMDD"), index);
      // 判断该站点是否在这一天之前就存在（create_datetime 单位为 unix 秒）
      const createDatetime = site?.create_datetime;
      const notMonitored = createDatetime ? createDatetime > date.unix() : false;
      dailyData[index] = {
        date: date.unix(),
        percent: formatNumber(ranges[index] || 0),
        down: { times: 0, duration: 0, events: [] },
        notMonitored,
      };
    });
      // Prepare total counters
      const total = { times: 0, duration: 0 };
      // If the API returned a "No records" string for logs, treat as downtime
      // for availability calculation: mark each day as 0% (unknown/gray) and
      // count one downtime event per day. (But keep notMonitored flagged based on create_datetime)
      const logsValue = site?.logs;
      const noRecords = typeof logsValue === "string" && /no\s*records?/i.test(logsValue);
      if (noRecords) {
        dailyData.forEach((d) => {
          d.percent = 0;
          d.down.times += 1;
        });
        // mark total downtime equal to days count
        const totalDowntimes = dailyData.length;
        total.times = totalDowntimes;
        total.duration = 0;
        return {
          id: site.id,
          name: site?.friendly_name || "未命名站点",
          url: showLinks || site?.type === 1 ? site?.url : undefined,
          status: 1, // unknown / gray
          type: site?.type ?? 1,
          interval: site?.interval ?? 0,
          percent: 0,
          days: dailyData?.reverse(),
          down: total,
        } as SiteStatusType;
      }
    // 获取总数据

    site?.logs?.forEach((log: any) => {
      if (log?.type === 1 || log?.type === 99) {
        const date = dayjs.unix(log?.datetime).format("YYYYMMDD");
        const dateIndex = timeMap.get(date);
        // 修改每日数据
        if (dateIndex !== undefined) {
          // 更新每日数据
          if (dailyData[dateIndex]) {
            dailyData[dateIndex].down.times += 1;
            dailyData[dateIndex].down.duration += log.duration;
            // push event details for later display in UI
            dailyData[dateIndex].down.events?.push(log);
          }
        }
        // 更新总数据
        total.times += 1;
        total.duration += log.duration;
      }
    });
    return {
      id: site.id,
      name: site?.friendly_name || "未命名站点",
      url: showLinks || site?.type === 1 ? site?.url : undefined,
      status: site?.status ?? 8,
      type: site?.type ?? 1,
      interval: site?.interval ?? 0,
      percent,
      days: dailyData?.reverse(),
      down: total,
    };
  });
  return {
    status: formatData.reduce(
      (acc, site) => {
        if (site.status === 2) acc.ok++;
        else if (site.status === 8 || site.status === 9) acc.error++;
        else if (site.status === 0 || site.status === 1) acc.unknown++;
        return acc;
      },
      { count: formatData.length, ok: 0, error: 0, unknown: 0 },
    ),
    data: formatData,
    timestamp: Date.now(),
  };
};

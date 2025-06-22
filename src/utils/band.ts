import { MOCK_BANDS_WITH_POSITIONS } from "@/constants/database/bands";
import { BandStatus, BandWithPositions, CreateBandInput } from "@/models/band";
import { BandPosition, CreateBandPositionInput } from "@/models/band-position";
import {
  createBandPositions,
  getBandPositionsById,
} from "@/services/bandPositionService";
import {
  createBand,
  getBandsByStatus,
  updateBand,
} from "@/services/bandsService";
import { handleDBResult } from "./database";

export const getPositionsByStatus = (
  positions: CreateBandPositionInput[] | BandPosition[]
) => {
  const recruitingPositions = positions.filter(
    (p) => p.status === "recruiting"
  );
  const occupiedPositions = positions.filter((p) => p.status === "occupied");
  return { recruitingPositions, occupiedPositions };
};

interface GetBandWithPositionsParams {
  status: BandStatus;
  production?: boolean;
}

export const getBandWithPositions = async ({
  status,
  production = false,
}: GetBandWithPositionsParams) => {
  if (!production) return MOCK_BANDS_WITH_POSITIONS[status];

  const bands = await getBandsByStatus({ status, production: true });
  if (!bands) return null;

  const bandPositionIDs = bands.flatMap((b) => b.bandPositionIDs);
  const bandPositions = await getBandPositionsById({
    bandPositionIDs,
    production: true,
  });
  if (!bandPositions) return null;

  const bandMap = new Map<string | number, BandPosition[]>();
  for (const bp of bandPositions) {
    if (!bandMap.has(bp.bandID)) {
      bandMap.set(bp.bandID, []);
    }
    bandMap.get(bp.bandID)!.push(bp);
  }

  const bandWithPositions: BandWithPositions[] = bands.map((b) => ({
    info: b,
    positions: bandMap.get(b._id) ?? [],
  }));

  return bandWithPositions;
};

interface CreateBandWithPositionsParams {
  positions: CreateBandPositionInput[];
  band: CreateBandInput;
}

export const createBandWithPositions = async ({
  positions,
  band,
}: CreateBandWithPositionsParams) => {
  const bandID = await createBand(band);
  if (!bandID) return false;

  const bandPositionIDs = await createBandPositions({
    positions,
    bandID,
  });
  if (!bandPositionIDs) return false;

  const res = await updateBand({
    bandID,
    data: { bandPositionIDs },
  });

  return res;
};

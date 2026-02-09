import "./GardenView.css";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import CardIcon from "../CardIcon";
import { GARDEN_ASSET_IMAGE_MAP, GARDEN_TIPS } from "../../assets/gardenAssets";

const ASSET_PLACEMENTS = {
    Seed: { left: 18, top: 55, scale: 0.6, rotation: -2, delay: 0 },
    "Grass Shoot": { left: 35, top: 70, scale: 1, rotation: -4, delay: 0 },
    Wildflower: { left: 65, top: 40, scale: 1.05, rotation: 3, delay: 0 },
    "Wattle Bloom": { left: 52, top: 82, scale: 1.05, rotation: 2, delay: 0 },
    Bottlebrush: { left: 92, top: 70, scale: 1.3, rotation: -3, delay: 0 },
    "Gum Tree": { left: 30, top: 30, scale: 1.7, rotation: -2, delay: 0 },
    "Rainbow Lorikeet": { left: 90, top: 40, scale: 1, rotation: 1, delay: 0 },
    Quokka: { left: 42, top: 45, scale: 0.9, rotation: 1, delay: 0 },
    Koala: { left: 76, top: 80, scale: 1.05, rotation: -1, delay: 0 },
    Kangaroo: { left: 15, top: 74, scale: 1.15, rotation: 2, delay: 0 },
};

const slugify = (value = "") =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

const getAssetPlacement = (name) =>
    ASSET_PLACEMENTS[name] || {
        left: 50,
        top: 80,
        scale: 1,
        rotation: 0,
        delay: 0,
    };

export default function GardenView({ currentPoints = 0, rewards = [] }) {
    const getRewardImage = (reward) =>
        GARDEN_ASSET_IMAGE_MAP[slugify(reward.name)] || null;
    const sortedAssets = [...rewards].sort((a, b) => a.points - b.points);
    const nextAsset = sortedAssets.find((asset) => asset.points > currentPoints);
    // Use the latest unlocked asset as the progress baseline (reverse so find hits the highest match).
    const previousAsset =
        [...sortedAssets].reverse().find((asset) => asset.points <= currentPoints) ||
        sortedAssets[0] ||
        { points: 0 };
    const progress =
        sortedAssets.length === 0
            ? 0
            : nextAsset
              ? (currentPoints - previousAsset.points) /
                Math.max(1, nextAsset.points - previousAsset.points)
              : 1;

    const unlockedAssets = sortedAssets.filter(
        (asset) => asset.points <= currentPoints
    );
    const unlockedLandscape = [...unlockedAssets]
        .filter((asset) => asset.category === "landscape")
        .sort((a, b) => b.points - a.points)[0];
    const gardenItems = unlockedAssets.filter(
        (asset) => asset.category === "plant" || asset.category === "animal"
    );
    const visibleGardenItems = gardenItems.filter((asset) => getRewardImage(asset));

    const landscapeKey = unlockedLandscape?.id;
    const landscapeClass = landscapeKey
        ? `garden-landscape--${landscapeKey}`
        : "garden-landscape--base";
    const landscapeImage =
        (unlockedLandscape ? getRewardImage(unlockedLandscape) : null) ||
        new URL("../../assets/landscape-default.svg", import.meta.url).href;

    return (
        <div className="user-dashboard-layout garden-view">
            <section className="garden-card garden-summary">
                <div className="garden-summary-header">
                    <div className="garden-summary-text">
                        <p className="garden-eyebrow">Wellbeing Garden</p>
                        <h2 className="garden-title">Growth Balance</h2>
                        <div className="garden-points">
                            <span className="garden-points-number">{currentPoints}</span>
                            <span className="garden-points-label">points</span>
                        </div>
                    </div>
                </div>
                <div className="garden-progress">
                    <div className="garden-progress-bar-row">
                        <div className="garden-progress-bar">
                            <div
                                className="garden-progress-fill"
                                style={{ width: `${Math.min(progress * 100, 100)}%` }}
                            />
                        </div>
                        {nextAsset ? (
                            <div className="garden-next-unlock garden-next-unlock--floating">
                                {getRewardImage(nextAsset) ? (
                                    <img
                                        className="garden-next-unlock-thumb"
                                        src={getRewardImage(nextAsset)}
                                        alt={nextAsset.name}
                                        loading="lazy"
                                        draggable="false"
                                    />
                                ) : null}
                                <div className="garden-next-unlock-info">
                                    <span className="garden-next-unlock-label">
                                        Next unlock
                                    </span>
                                    <span className="garden-next-unlock-name">
                                        {nextAsset.name}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="garden-next-unlock garden-next-unlock--complete garden-next-unlock--floating">
                                All assets unlocked.
                            </div>
                        )}
                    </div>
                    {nextAsset ? (
                        <>
                            <div className="garden-progress-meta">
                                {/* <span className="garden-progress-start">
                                    {previousAsset.points} pts
                                </span> */}
                                <span className="garden-progress-center">
                                    {nextAsset.points - currentPoints} pts to go
                                </span>
                                <span className="garden-progress-end">
                                    {nextAsset.points} pts
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="garden-progress-meta">
                            <div className="garden-next-unlock garden-next-unlock--complete">
                                All assets unlocked.
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className="garden-card garden-canvas-card">
                <div className={`garden-canvas ${landscapeClass} garden-canvas--image`}>
                    <img
                        className="garden-landscape-image"
                        src={landscapeImage}
                        alt=""
                        aria-hidden="true"
                    />
                    <div className="garden-canvas-sky" />
                    <div className="garden-canvas-ground" />
                    <div className="garden-items">
                        {visibleGardenItems.length === 0 ? (
                            <div className="garden-empty">
                                Your first seed is ready to grow.
                            </div>
                        ) : (
                            visibleGardenItems.map((asset) => {
                                const placement = getAssetPlacement(asset.name);
                                return (
                                    <img
                                        key={asset.id}
                                        src={getRewardImage(asset)}
                                        alt={asset.name}
                                        className={`garden-item-asset garden-item-asset--${asset.category}`}
                                        loading="lazy"
                                        draggable="false"
                                        style={{
                                            left: `${placement.left}%`,
                                            top: `${placement.top}%`,
                                            "--scale": placement.scale,
                                            "--rotation": `${placement.rotation}deg`,
                                            animationDelay: `${placement.delay}s`,
                                        }}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="garden-unlocks">
                    <h3 className="garden-section-title">Growing next</h3>
                    <div className="garden-unlock-grid">
                        {sortedAssets.map((asset) => {
                            const isUnlocked = asset.points <= currentPoints;
                            return (
                                <div
                                    key={asset.id}
                                    className={`garden-unlock-card ${
                                        isUnlocked ? "garden-unlock-card--unlocked" : ""
                                    }`}
                                >
                                    {!isUnlocked ? (
                                        <span className="garden-unlock-lock" aria-label="Locked">
                                            <CardIcon
                                                icon={faLock}
                                                size="lg"
                                                color="rgba(0, 0, 0, 0.45)"
                                            />
                                        </span>
                                    ) : null}
                                    {getRewardImage(asset) ? (
                                        <img
                                            className="garden-unlock-thumb"
                                            src={getRewardImage(asset)}
                                            alt={asset.name}
                                            loading="lazy"
                                            draggable="false"
                                        />
                                    ) : (
                                        <div
                                            className="garden-unlock-thumb"
                                            aria-hidden="true"
                                        />
                                    )}
                                    <div className="garden-unlock-info">
                                        <p className="garden-unlock-name">
                                            {asset.name}
                                        </p>
                                        <p className="garden-unlock-type">
                                            {asset.category}
                                        </p>
                                        <p className="garden-unlock-points">
                                            {asset.points} pts
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="garden-card garden-tips">
                <h3 className="garden-section-title">Gardening tips</h3>
                <ul className="garden-tip-list">
                    {GARDEN_TIPS.map((tip) => (
                        <li key={tip} className="garden-tip">
                            {tip}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

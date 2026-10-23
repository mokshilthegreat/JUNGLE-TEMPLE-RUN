import React, { useState } from 'react';

interface ShopProps {
  onBack: () => void;
  money: number;
  diamonds: number;
}

const categories = ['WEAPONS', 'GADGETS', 'TOOLS', 'OUTFITS', 'BAG', 'UPGRADES'];

const shopItems = {
  WEAPONS: [
    { id: 'w1', name: 'Silenced Pistol', desc: 'Low noise, medium damage.', price: 5000, icon: '🔫', stats: '+20 Combat, +High Stealth' },
    { id: 'w2', name: 'Stun Gun', desc: 'Non-lethal takedowns from range.', price: 8000, icon: '⚡', stats: '+30 Combat, Non-lethal' },
    { id: 'w3', name: 'Smoke Grenade', desc: 'Creates cover to escape.', price: 2000, icon: '💨', stats: 'Consumable (x3)' },
    { id: 'w4', name: 'Combat Knife', desc: 'Silent melee takedowns.', price: 3000, icon: '🔪', stats: '+40 Combat, +Max Stealth' },
    { id: 'w5', name: 'Tranquilizer Dart', desc: 'Puts enemies to sleep.', price: 12000, icon: '🎯', stats: '+50 Combat, Silent' },
  ],
  GADGETS: [
    { id: 'g1', name: 'EMP Grenade', desc: 'Disables cameras and lasers.', price: 4000, icon: '💣', stats: 'Consumable (x2)' },
    { id: 'g2', name: 'Decoy Device', desc: 'Lures guards away.', price: 2500, icon: '📻', stats: 'Consumable (x3)' },
    { id: 'g3', name: 'Thermal Goggles', desc: 'See enemies through walls.', price: 15000, icon: '🥽', stats: 'Passive Equipment' },
    { id: 'g4', name: 'Hacking PDA', desc: 'Speeds up terminal hacks.', price: 10000, icon: '📱', stats: '+30 Hacking speed' },
    { id: 'g5', name: 'Camera Jammer', desc: 'Temporarily blind a camera.', price: 6000, icon: '📡', stats: 'Cooldown: 60s' },
  ],
  TOOLS: [
    { id: 't1', name: 'Advanced Lockpick', desc: 'Easier lockpicking minigame.', price: 3000, icon: '🔓', stats: 'Permanent Upgrade' },
    { id: 't2', name: 'Glass Cutter', desc: 'Silently open display cases.', price: 5000, icon: '💎', stats: 'Required for Museum' },
    { id: 't3', name: 'Keycard Cloner', desc: 'Copy cards from a distance.', price: 20000, icon: '💳', stats: 'Range: 5m' },
    { id: 't4', name: 'Bolt Cutters', desc: 'Cut chain-link fences.', price: 1500, icon: '✂️', stats: 'Permanent Tool' },
    { id: 't5', name: 'Stethoscope', desc: 'Crack safes faster.', price: 8500, icon: '🩺', stats: '+50% Safe cracking' },
  ],
  OUTFITS: [
    { id: 'o1', name: 'Night Suit', desc: 'Standard stealth gear.', price: 0, icon: '👕', stats: 'Default' },
    { id: 'o2', name: 'Urban Camo', desc: 'Blend in better in city maps.', price: 10000, icon: '🧥', stats: '+10 Stealth in City' },
    { id: 'o3', name: 'Guard Uniform', desc: 'Fool guards from afar.', price: 25000, icon: '👮', stats: 'Reduces detection speed' },
    { id: 'o4', name: 'Tech Wear', desc: 'Extra pockets for gadgets.', price: 15000, icon: '🦺', stats: '+1 Gadget Slot' },
    { id: 'o5', name: 'Armored Vest', desc: 'Survive more gunshots.', price: 18000, icon: '🛡️', stats: '+50 Health' },
  ],
  BAG: [
    { id: 'b1', name: 'Duffel Bag', desc: 'Standard capacity.', price: 0, icon: '🎒', stats: '10kg Capacity' },
    { id: 'b2', name: 'Reinforced Bag', desc: 'Carry more loot.', price: 5000, icon: '🧳', stats: '15kg Capacity' },
    { id: 'b3', name: 'Tactical Backpack', desc: 'High capacity, low noise.', price: 15000, icon: '🎒', stats: '20kg Capacity' },
    { id: 'b4', name: 'Heist Tote', desc: 'Massive space.', price: 30000, icon: '🛍️', stats: '30kg Capacity' },
    { id: 'b5', name: 'Anti-grav Pack', desc: 'Zero weight penalty.', price: 100, isDiamond: true, icon: '🛸', stats: 'Infinite weight' },
  ],
  UPGRADES: [
    { id: 'u1', name: 'Movement Speed I', price: 2000, icon: '👟', stats: '+5% Speed' },
    { id: 'u2', name: 'Stamina Regen I', price: 2500, icon: '🫀', stats: '+10% Regen' },
    { id: 'u3', name: 'Health Max I', price: 3000, icon: '❤️', stats: '+20 Health' },
    { id: 'u4', name: 'Hacking Skill I', price: 4000, icon: '💻', stats: '+10% Hack speed' },
    { id: 'u5', name: 'Lockpick Skill I', price: 3500, icon: '🔧', stats: '+10% Lockpick sweet spot' },
  ]
};

const Shop: React.FC<ShopProps> = ({ onBack, money: initialMoney, diamonds: initialDiamonds }) => {
  const [activeTab, setActiveTab] = useState(categories[0]);
  const [ownedItems, setOwnedItems] = useState<Set<string>>(new Set(['w1', 'o1', 'b1']));
  const [currentMoney, setCurrentMoney] = useState(initialMoney);
  const [currentDiamonds, setCurrentDiamonds] = useState(initialDiamonds);

  const handleBuy = (item: any) => {
    if (item.isDiamond) {
      if (currentDiamonds >= item.price) {
        setCurrentDiamonds(prev => prev - item.price);
        setOwnedItems(prev => new Set(prev).add(item.id));
      }
    } else {
      if (currentMoney >= item.price) {
        setCurrentMoney(prev => prev - item.price);
        setOwnedItems(prev => new Set(prev).add(item.id));
      }
    }
  };

  return (
    <div className="w-full h-screen bg-[#050B14] text-white flex flex-col font-sans">
      <div className="h-16 border-b border-cyan-900 flex items-center justify-between px-6 bg-black/50">
        <div className="flex items-center">
          <button onClick={onBack} className="text-cyan-400 hover:text-cyan-300 font-bold mr-6 transition-colors">
            &larr; BACK
          </button>
          <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            BLACK MARKET
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-green-400 bg-green-900/20 px-3 py-1 rounded border border-green-900/50">
            <span>$</span>
            <span className="font-mono">{currentMoney.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-cyan-400 bg-cyan-900/20 px-3 py-1 rounded border border-cyan-900/50">
            <span>💎</span>
            <span className="font-mono">{currentDiamonds}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Categories Sidebar */}
        <div className="w-64 border-r border-cyan-900/50 bg-[#0a0e1a] flex flex-col p-4 space-y-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`py-3 px-4 text-left font-bold rounded transition-colors ${
                activeTab === cat 
                  ? 'bg-cyan-900/50 text-cyan-300 border-l-4 border-cyan-400' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white border-l-4 border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {(shopItems as any)[activeTab].map((item: any) => {
              const isOwned = ownedItems.has(item.id);
              const canAfford = item.isDiamond ? currentDiamonds >= item.price : currentMoney >= item.price;
              
              return (
                <div key={item.id} className={`bg-[#0a0e1a] border rounded-lg p-5 flex flex-col transition-all ${
                  isOwned ? 'border-gray-700 bg-gray-900/50' : 'border-cyan-900/50 hover:border-cyan-500'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-16 h-16 bg-black rounded flex items-center justify-center text-3xl border border-gray-800">
                      {item.icon}
                    </div>
                    {isOwned ? (
                      <span className="bg-gray-800 text-gray-400 text-xs font-bold px-2 py-1 rounded">OWNED</span>
                    ) : (
                      <div className={`font-mono font-bold flex items-center ${item.isDiamond ? 'text-cyan-400' : 'text-green-400'}`}>
                        <span className="mr-1">{item.isDiamond ? '💎' : '$'}</span>
                        {item.price.toLocaleString()}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1 text-white">{item.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 h-10">{item.desc}</p>
                  
                  <div className="text-xs text-cyan-600 font-mono mb-4 bg-black/50 p-2 rounded border border-cyan-900/30">
                    {item.stats}
                  </div>
                  
                  <div className="mt-auto">
                    <button
                      disabled={isOwned || !canAfford}
                      onClick={() => handleBuy(item)}
                      className={`w-full py-2 font-bold rounded transition-colors ${
                        isOwned 
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          : canAfford
                            ? 'bg-cyan-700 hover:bg-cyan-600 text-white'
                            : 'bg-red-900/30 text-red-500 cursor-not-allowed border border-red-900/50'
                      }`}
                    >
                      {isOwned ? 'EQUIPPED' : canAfford ? 'PURCHASE' : 'INSUFFICIENT FUNDS'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

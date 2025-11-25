#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Env, String as SorobanString, Address, Map, Symbol};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct LotMetadata {
    pub lot_id: SorobanString,
    pub production_date: u64,        // Timestamp
    pub batch_number: SorobanString,
    pub quantity: u32,
    pub quality_score: u8,           // 0-100
    pub location: SorobanString,
    pub notes: SorobanString,
    pub registered_by: Address,      // Smart wallet address
}

const LOTS_KEY: Symbol = symbol_short!("LOTS");

#[contract]
pub struct LotRegistry;

#[contractimpl]
impl LotRegistry {
    /// Register a new production lot
    pub fn register_lot(
        env: Env,
        lot_id: SorobanString,
        production_date: u64,
        batch_number: SorobanString,
        quantity: u32,
        quality_score: u8,
        location: SorobanString,
        notes: SorobanString,
    ) {
        let caller = env.invoker();
        
        // Validate quality score
        if quality_score > 100 {
            panic!("Quality score must be between 0 and 100");
        }
        
        let metadata = LotMetadata {
            lot_id: lot_id.clone(),
            production_date,
            batch_number,
            quantity,
            quality_score,
            location,
            notes,
            registered_by: caller,
        };
        
        // Store in persistent storage
        let mut lots: Map<SorobanString, LotMetadata> = env
            .storage()
            .persistent()
            .get(&LOTS_KEY)
            .unwrap_or(Map::new(&env));
        
        lots.set(lot_id.clone(), metadata);
        env.storage().persistent().set(&LOTS_KEY, &lots);
    }
    
    /// Get lot metadata by lot ID
    pub fn get_lot(env: Env, lot_id: SorobanString) -> Option<LotMetadata> {
        let lots: Map<SorobanString, LotMetadata> = env
            .storage()
            .persistent()
            .get(&LOTS_KEY)
            .unwrap_or(Map::new(&env));
        
        lots.get(lot_id)
    }
    
    /// Check if a lot exists
    pub fn lot_exists(env: Env, lot_id: SorobanString) -> bool {
        let lots: Map<SorobanString, LotMetadata> = env
            .storage()
            .persistent()
            .get(&LOTS_KEY)
            .unwrap_or(Map::new(&env));
        
        lots.contains_key(lot_id)
    }
}

#[cfg(test)]
mod test;


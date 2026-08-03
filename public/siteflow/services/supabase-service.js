(function(){
  'use strict';
  const cfg=window.CAZARE_CONFIG||window.SITEFLOW_CONFIG||{};
  if(!window.supabase) throw new Error('Biblioteca Supabase nu s-a încărcat.');
  if(!cfg.supabaseUrl||!cfg.supabaseAnonKey) throw new Error('Completează supabase-config.js.');
  const client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  async function fetchTable(table,select='*'){
    const {data,error}=await client.from(table).select(select);
    if(error) throw new Error(`${table}: ${error.message}`);
    return data||[];
  }
  async function fetchOptional(table,select='*'){
    try{return await fetchTable(table,select)}catch(err){console.warn(`Tabel opțional ${table}:`,err.message);return []}
  }
  async function loadPlatformData(){
    const [locations,units,people,stays,sites,unitRates]=await Promise.all([
      fetchTable('locations','*'),fetchTable('accommodation_units','*'),fetchTable('people','*'),fetchTable('accommodation_stays','*'),fetchOptional('sites','*'),fetchOptional('unit_rates','*')
    ]);
    return {locations:locations.filter(x=>x.active!==false),units:units.filter(x=>x.active!==false),people,stays:stays.filter(x=>x.status!=='cancelled'),sites:sites.filter(x=>x.active!==false),unitRates:unitRates.filter(x=>x.active!==false)};
  }
  async function updateStay(id,changes){
    const {data,error}=await client.from('accommodation_stays').update(changes).eq('id',id).select().single();
    if(error) throw new Error(error.message);
    return data;
  }
  async function createStay(payload){
    const {data,error}=await client.from('accommodation_stays').insert(payload).select().single();
    if(error) throw new Error(error.message);
    return data;
  }
  async function createPerson(payload){
    const {data,error}=await client.from('people').insert(payload).select().single();
    if(error) throw new Error(error.message); return data;
  }
  async function createLocation(payload){
    const {data,error}=await client.from('locations').insert(payload).select().single();
    if(error) throw new Error(error.message); return data;
  }
  async function createUnit(payload){
    const {data,error}=await client.from('accommodation_units').insert(payload).select().single();
    if(error) throw new Error(error.message); return data;
  }
  async function updateUnit(id,changes){const {data,error}=await client.from('accommodation_units').update(changes).eq('id',id).select().single();if(error)throw new Error(error.message);return data;}
  async function saveUnitRate(unitId,payload,existingId=null){
    const body={unit_id:unitId,rate_type:payload.rate_type,amount:Number(payload.amount||0),currency:payload.currency||'EUR',valid_from:payload.valid_from||new Date().toISOString().slice(0,10),valid_to:payload.valid_to||null,includes_utilities:payload.includes_utilities??true,includes_cleaning:payload.includes_cleaning??false,includes_tax:payload.includes_tax??false,notes:payload.notes||null,active:true};
    const query=existingId?client.from('unit_rates').update(body).eq('id',existingId):client.from('unit_rates').insert(body);
    const {data,error}=await query.select().single();if(error)throw new Error(error.message);return data;
  }
  async function updatePerson(id,changes){const {data,error}=await client.from('people').update(changes).eq('id',id).select().single();if(error)throw new Error(error.message);return data;}
  async function updateLocation(id,changes){const {data,error}=await client.from('locations').update(changes).eq('id',id).select().single();if(error)throw new Error(error.message);return data;}
  async function updateSite(id,changes){const {data,error}=await client.from('sites').update(changes).eq('id',id).select().single();if(error)throw new Error(error.message);return data;}
  async function createSite(payload){
    const {data,error}=await client.from('sites').insert(payload).select().single();
    if(error) throw new Error(error.message); return data;
  }
  async function deleteStay(id){
    const {error}=await client.from('accommodation_stays').delete().eq('id',id);
    if(error) throw new Error(error.message);
  }
  window.SiteFlowApi={client,loadPlatformData,updateStay,createStay,createPerson,createLocation,createUnit,updateUnit,saveUnitRate,updatePerson,updateLocation,updateSite,createSite,deleteStay};
})();

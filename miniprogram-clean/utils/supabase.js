// utils/supabase.js
/**
 * Simple Supabase client wrapper for Mini Program.
 * It uses the RESTful API provided by Supabase.
 * Configuration (base URL & API key) is taken from getApp().globalData.
 */
const app = getApp();

function request({ url, method = 'GET', data = {} }) {
    return new Promise((resolve, reject) => {
        wx.request({
            url,
            method,
            data,
            header: {
                apikey: app.globalData.apiKey,
                Authorization: `Bearer ${app.globalData.apiKey}`,
                'Content-Type': 'application/json'
            },
            success: res => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            },
            fail: err => reject(err)
        });
    });
}

/**
 * Upsert (insert or update) a record into a Supabase table.
 * @param {string} table - Table name.
 * @param {object} record - Record object, must contain primary key (e.g., id).
 * @returns {Promise}
 */
function upsert(table, record) {
    const url = `${app.globalData.apiBaseUrl}/rest/v1/${table}`;
    // Supabase upsert via POST with "Prefer: resolution=merge-duplicates"
    return new Promise((resolve, reject) => {
        wx.request({
            url,
            method: 'POST',
            data: record,
            header: {
                apikey: app.globalData.apiKey,
                Authorization: `Bearer ${app.globalData.apiKey}`,
                'Content-Type': 'application/json',
                Prefer: 'resolution=merge-duplicates'
            },
            success: res => {
                if (res.statusCode === 201 || res.statusCode === 200) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            },
            fail: err => reject(err)
        });
    });
}

module.exports = {
    request,
    upsert
};

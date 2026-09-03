import streamlit as st
import sqlite3
import pandas as pd
import os
from agent import create_dev_chat, chat_with_agent

# Ensure we use the correct absolute path for the DB
DB_PATH = os.path.join(os.path.dirname(__file__), "dev_brain.db")

st.set_page_config(page_title="Dev AI Console", layout="wide", page_icon="🤖")

st.title("SDG Internal Dev AI")
st.markdown("⚠️ **INTERNAL USE ONLY.** This instance must not be exposed to production users.")

if "chat_session" not in st.session_state:
    st.session_state.chat_session = create_dev_chat()

if "messages" not in st.session_state:
    st.session_state.messages = []

tabs = st.tabs(["Developer Chat", "Knowledge Base (Lessons)", "Security & Architecture"])

with tabs[0]:
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])
            
    if prompt := st.chat_input("Ask the internal AI to analyze code, run tests, or fix a bug..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)
            
        with st.chat_message("assistant"):
            with st.spinner("Analyzing and reasoning... (tools may be executing)"):
                response = chat_with_agent(st.session_state.chat_session, prompt)
                st.markdown(response)
        st.session_state.messages.append({"role": "assistant", "content": response})

with tabs[1]:
    st.subheader("Internal Development Lessons")
    if st.button("Refresh Lessons"):
        st.rerun()
    try:
        conn = sqlite3.connect(DB_PATH)
        df = pd.read_sql_query("SELECT id, title, category, confidence, date FROM lessons ORDER BY date DESC", conn)
        st.dataframe(df, use_container_width=True)
        conn.close()
    except Exception as e:
        st.error(f"Could not load memory: {e}")

with tabs[2]:
    st.subheader("Security Findings & ADRs")
    try:
        conn = sqlite3.connect(DB_PATH)
        df_sec = pd.read_sql_query("SELECT id, title, problem, solution, category FROM lessons WHERE category IN ('SECURITY', 'ARCHITECTURE')", conn)
        st.dataframe(df_sec, use_container_width=True)
        conn.close()
    except Exception as e:
        st.error(f"No records found.")
